import { supabase } from "@/utils/supabase/admin";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { data: { object: { metadata: { user_id } } } } = data;
        switch (data.type) {
            case 'customer.subscription.created':
                await supabase
                    .from('user')
                    .update({ 'plan_id': 'pro' })
                    .eq('user_id', user_id);
                break;
            case 'customer.subscription.deleted':
                await supabase
                    .from('user')
                    .update({ 'plan_id': 'free' })
                    .eq('user_id', user_id);
                break;
        }
        return Response.json(true);
    } catch (error) {
        console.error(error);
    }
}