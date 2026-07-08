import { createClient } from "@/utils/supabase/server";
import { UserData } from "@/lib/types";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const data = Object.fromEntries(request.nextUrl.searchParams.entries()) as Pick<UserData, 'user_id'>;
    const { data: user, error } = await createClient(await cookies())
        .from('user')
        .select('*,plan(*)')
        .eq('user_id', data.user_id)
        .maybeSingle();
    if (error) Response.json(error.message, { status: 200 });
    return Response.json(user);
}

export async function POST(request: Request) {
    const data = await request.json() as Omit<UserData, 'created_at' | 'plan'> & { plan_id: number };
    const { data: user, error } = await createClient(await cookies())
        .from('user')
        .insert(data)
        .select('*,plan(*)')
        .single();
    if (error) Response.json(error.message, { status: 200 });
    return Response.json(user);
}

export async function PATCH(request: Request) {
    const { user_id, data } = await request.json();
    await createClient(await cookies())
        .from('user')
        .update(data)
        .eq('user_id', user_id)
    return Response.json(null);
}