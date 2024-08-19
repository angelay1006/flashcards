import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import {getAuth} from '@clerk/nextjs/server';
import {ClerkClient} from '@clerk/clerk-sdk-node';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

// since stripe takes cents, convert to dollar
const formatAmountForStripe = (amount) => {
    return Math.round(amount * 100);
}

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const session_id = searchParams.get('session_id');

    try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
        return NextResponse.json(checkoutSession);
    } catch (error) {
        console.error("Error retrieving checkout session:");
        return NextResponse.json({error: {message: error.message}}, {status:500});
    }

}

// 1. create stripe customerId for each user before creating checkout session
// 2. use stripe webhooks to update user subscription status in clerk's metadata
// 3. check subscription status in app

export async function POST(req) {
    try {
        // Create Checkout Sessions from body params.
        const params = {
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Pro Subscription',
                        },
                        unit_amount: formatAmountForStripe(0.99),
                        recurring: {
                            interval: 'month',
                            interval_count: 1,
                        }
                    },

                    quantity: 1,
                },
            ],
            success_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
        };

        const checkoutSession = await stripe.checkout.sessions.create(params);

        return NextResponse.json(checkoutSession, {
            status: 200,
        })

    } catch (err) { 
        console.error('Error creating checkout session:', err)
    }
}