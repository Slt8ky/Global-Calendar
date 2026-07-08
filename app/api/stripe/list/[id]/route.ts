import { stripe } from "@/utils/stripe/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data } = await stripe.balanceTransactions.list({
        limit: 100,
    }, {
        stripeAccount: id
    });
    return Response.json(data);
}