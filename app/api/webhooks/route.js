// route that handles stripe webhook events
// here is where we update user's subscription status in clerk

// HUGE ISSUE 8/22/24: this route doesn't work! keeps returning 404 in postman 
// in testing. so i'm going to try an alternative solution where i put the webhook in /pages instead of /app

import Stripe from 'stripe';
import {clerkClient} from '@clerk/clerk-sdk-node';
import {NextResponse} from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

const clerk = clerkClient();

// export async function POST() {
//     return NextResponse.json({message: "Webhook Route is working"});
// }

export async function POST(req) {
    const signature = req.headers['stripe-signature'];
    
    let event;

    try {
        const body = await req.text();
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        console.log("Webhook event type received:", event.type);
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: { message: "Invalid Stripe webhook signature" } }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log("Received session in webhook:", session); // Log the entire session object for debugging

        // we have attempted to store the Clerk user ID in the metadata in checkout_session route.
        const userId = session.metadata?.clerk_user_id;
        if (!userId) {
            console.error("User ID not found in session metadata.");
            return NextResponse.json({error: {message: "User ID not found in session metadata"} }, {status: 400});
        }

        try {
            console.log("Updating Clerk user ID:", userId);
            const user = await clerk.users.getUser(userId);
            // update user's subscription status in clerk
            await clerk.users.updateUser(userId, {
                publicMetadata: {
                    ...user.publicMetadata,
                    proUser: true,
                    purchaseDate: new Date().toISOString(),
                }
            });

            console.log("Updated user metadata:", JSON.stringify(updatedUser.publicMetadata, null, 2));
        } catch (err) {
            console.error("Error updating user in Clerk:", err.message);
            return NextResponse.json({error: {message: "Failed to update user in Clerk"}}, {status:500});
        }
    }

    if (event.type === 'checkout.session.completed') {
        console.log("checkout session completed:", event.data.object);
    }

    return NextResponse.json({received: true}, {status:200});
}