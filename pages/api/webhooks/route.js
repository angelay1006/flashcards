
// route that handles stripe webhook events
// here is where we update user's subscription status in clerk
import Stripe from 'stripe';
import {clerkClient} from '@clerk/clerk-sdk-node';
import {Readable } from 'stream';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

// Disable Next.js's default body parsing to handle raw body
export const config = {
    api: {
        bodyParser: false,
    },
};

// Helper function to read the raw body
const buffer = async (readable) => {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
};


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const signature = req.headers['stripe-signature'];
    if (!signature) {
        return res.status(400).json({ error: 'Missing Stripe signature' });
    }

    let event;

    try {
        const rawBody = await buffer(req);
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        console.log("Webhook event type received:", event.type);
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).json({ error: { message: "Invalid Stripe webhook signature" } });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log("Received session in webhook:", session);

        const userId = session.metadata?.clerk_user_id;
        if (!userId) {
            console.error("User ID not found in session metadata.");
            return res.status(400).json({ error: { message: "User ID not found in session metadata" } });
        }

        try {
            console.log("Updating Clerk user ID:", userId);
            const user = await clerkClient.users.getUser(userId);

            // Update user's subscription status in Clerk
            await clerkClient.users.updateUser(userId, {
                publicMetadata: {
                    ...user.publicMetadata,
                    proUser: true,
                    purchaseDate: new Date().toISOString(),
                }
            });

            const updatedUser = await clerkClient.users.getUser(userId);
            console.log("Updated user metadata:", JSON.stringify(updatedUser.publicMetadata, null, 2));
        } catch (err) {
            console.error("Error updating user in Clerk:", err.message);
            return res.status(500).json({error: {message: "Failed to update user in Clerk" } });
        }
    }

    return res.status(200).json({ received: true });
}