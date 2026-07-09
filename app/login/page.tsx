'use client';

import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

const handleLogin = async () => {
    await createClient().auth.signInWithOAuth({
        provider: 'google',
        options: {
            scopes: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.app.created https://www.googleapis.com/auth/calendar.calendarlist https://www.googleapis.com/auth/calendar.calendarlist.readonly',
            redirectTo: `https://${window.location.origin}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent'
            }
        }
    });
}

export default function Page() {

    return (
        <div className="w-full h-dvh flex justify-center items-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>SolopreneurHub</CardTitle>
                    <CardDescription>
                        Your focus is your currency. Let&apos;s make today count.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex-col gap-2">
                    <Button variant="default" className="w-full" onClick={handleLogin}>
                        Login with Google
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}