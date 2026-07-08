"use client";

import { useAuth } from "@/lib/context/AuthProvider";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

export function AuthListener() {
    const { user } = useAuth();
    const path = usePathname();

    useEffect(() => {
        if (['/auth', '/api'].some(prefix => path.startsWith(prefix))) return;

        if (!user && !path.startsWith('/login')) {
            redirect("/login");
        }

        if (user && !path.startsWith('/dashboard')) {
            redirect("/dashboard");
        }
    }, [user, path]);

    return null;
}