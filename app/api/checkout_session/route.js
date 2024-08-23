import {NextResponse} from 'next/server';
import Stripe from 'stripe';
import {getAuth, clerkClient} from '@clerk/nextjs/server';

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
        return NextResponse.json({ error: { message: error.message } }, { status: 500 });
    }

}

// 1. create stripe customerId for each user before creating checkout session
// 2. use stripe webhooks to update user subscription status in clerk's metadata
// 3. check subscription status in app

export async function POST(req) {
    try {
        // 08/19/24: this is for authenticating whether user is pro or not
        // get logged-in user's ID from Clerk
        console.log("calling from POST handler in checkout session route.js");
        const {userId} = getAuth(req);
        const clerk = clerkClient();
        const user = await clerk.users.getUser(userId); // retrieve user from clerk
        let customerId = user.publicMetadata.stripeCustomerId;

        // if user doesn't have customerId, create one
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress,
            });

            customerId = customer.id;

            // save customerId in Clerk's user metadata
            await clerk.users.updateUser(userId, {
                publicMetadata: {stripeCustomerId: customerId },
            });
        }

        // Create Checkout Sessions from body params.
        const params = {
            mode: 'payment', // changed from 'subscription'
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Pro User',
                        },
                        unit_amount: formatAmountForStripe(0.99),
                        // recurring: {
                        //     interval: 'month',
                        //     interval_count: 1,
                        // }
                    },
                    quantity: 1,
                },
            ],
            customer: customerId, // added 8/20 
            success_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {clerk_user_id: userId} // pass clerk user id as metadata
        };

        const checkoutSession = await stripe.checkout.sessions.create(params);
        console.log("Checkout session:", checkoutSession);
        return NextResponse.json({sessionId: checkoutSession.id}, {status: 200,});
    } catch (err) {
        console.error('Error creating checkout session:', err);
        return NextResponse.json({error: {message: err.message}}, {status: 500});
    }
}