// route that handles stripe webhook events
// here is where we update user's subscription status in clerk
import { buffer } from 'micro';
import Stripe from 'stripe';
import { ClerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

export async function POST(req) {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            await buffer(req),
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
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
            // update user's subscription status in clerk
            await ClerkClient.users.updateUser(userId, {
                publicMetadata: {
                    subscription: {
                        status: 'active',
                        plan: 'pro',
                    },
                },
            });
            console.log(`User ${userId} updated to Pro plan`);
        } catch (err) {
            console.error("Error updating user in Clerk:", err.message);
            return NextResponse.json({error: {message: "Failed to update user in Clerk"}}, {status:500});
        }
    }

    return NextResponse.json({received: true}, {status:200});
}