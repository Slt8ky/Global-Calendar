'use client';

import { useAuth } from "@/lib/context/AuthProvider";
import { UserData } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
import { User } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import UserSettings from "./UserSettings";
import { useTimer } from "@/lib/context/TimerProvider";

const handleLogout = async (setUser: Dispatch<SetStateAction<UserData | null>>) => {
    await createClient().auth.signOut();
    setUser(null);
}

function Timer() {
    const timer = useTimer();
    return <span className="text-neutral-800">{timer.toLocaleTimeString()}</span>
}

export function Navigation() {
    const { user, setUser } = useAuth();

    return user && (
        <div className="flex w-full h-fit justify-between items-center">
            <div className="flex gap-3 items-center text-3xl">
                <span className="font-bold">SolopreneurHub</span>
                <Timer />
            </div>
            <div className="flex gap-2 items-center text-lg font-bold">
                {user.plan.name === 'free' ? (
                    <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">{user.plan.name}</Badge>
                ) : (
                    <Badge className="bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300">{user.plan.name}</Badge>
                )}
                {user.name}
                <Avatar>
                    <AvatarImage src={user.picture}></AvatarImage>
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>
                <UserSettings />
                <Button variant={"destructive"} onClick={() => handleLogout(setUser)}>Logout</Button>
            </div>
        </div>
    )
}
