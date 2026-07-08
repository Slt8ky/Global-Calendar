import { stripe } from "@/utils/stripe/server";

export async function POST(request: Request) {
    const { email, user_id } = await request.json();
    const { url } = await stripe.checkout.sessions.create({
        customer_email: email,
        success_url: `https://${process.env.DOMAIN}?success=true`,
        line_items: [
            {
                price: process.env.STRIPE_PRODUCT_PRICE_ID,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        subscription_data: {
            metadata: {
                user_id
            }
        }
    });
    return Response.json(url);
}