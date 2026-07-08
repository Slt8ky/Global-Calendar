import { stripe } from "@/utils/stripe/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { code } = Object.fromEntries(request.nextUrl.searchParams.entries());
    const { stripe_user_id } = await stripe.oauth.token({
        grant_type: 'authorization_code',
        code: code,
    });
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
        .from('user')
        .update({ stripe_user_id })
        .eq('user_id', user?.id);
    return NextResponse.redirect(new URL('/dashboard?success=true', request.url));
}