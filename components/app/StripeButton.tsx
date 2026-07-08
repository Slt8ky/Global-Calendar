'use client';

import { useAuth } from '@/lib/context/AuthProvider';
import { Link2, Link2Off } from 'lucide-react';
import { Button } from '../ui/button';

export function UnLinkStripeButton() {
    const { user } = useAuth();

    const handleUnLink = () => {
        const stripe_user_id = user?.stripe_user_id;
        if (!stripe_user_id) return;
        window.location.href = `/api/stripe?stripe_user_id=${stripe_user_id}`;
    }

    return (
        <Button variant={"success"} onClick={handleUnLink}>
            <Link2Off />
            Unlink
        </Button>
    )
}

export function LinkStripeButton() {
    const handleLink = () => {
        const clientId = process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID;
        const stripeOAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write`;
        window.location.href = stripeOAuthUrl;
    }

    return (
        <Button variant={"success"} onClick={handleLink}>
            <Link2 />
            Link
        </Button>
    )
}
