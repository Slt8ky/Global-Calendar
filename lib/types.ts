import { ReactNode } from "react";

export type UserData = {
    user_id: string;
    email: string;
    name: string;
    picture: string;
    provider_token: string,
    provider_refresh_token: string,
    plan: PlanData;
    plan_expire_at: string | null;
    created_at: string;
    stripe_user_id: string | null;
};

export type PlanData = {
    plan_id: string;
    name: string;
    price_month: number;
    price_year: number;
    view_days: number;
};

export type ButtonsProps = { icon: ReactNode; name: string; hours: number, colorId: string }