'use client';

import { UserData } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{ user: UserData | null, setUser: Dispatch<SetStateAction<UserData | null>> } | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error();
    return context;
};

const fetchUser = async () => {
    const { data: { session } } = await createClient().auth.getSession();

    if (!session) {
        return null;
    } else {
        const { provider_token, provider_refresh_token, user } = session;
        const { id, user_metadata: { email, name, picture } } = user;
        try {
            const { data: existUser } = await axios.get('/api/user', {
                params: {
                    user_id: id
                }
            });
            if (existUser) {
                return existUser;
            } else {
                try {
                    const { data: newUser } = await axios.post('/api/user', {
                        user_id: id,
                        email,
                        name,
                        provider_token,
                        provider_refresh_token,
                        picture,
                        plan_id: 'free',
                        plan_expire_at: null,
                    });
                    return newUser;
                } catch (error) {
                    throw new Error(error as string)
                }
            }
        } catch (error) {
            throw new Error(error as string)
        }
    }
}

export function AuthProvider({ children }: { children?: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const params = useSearchParams();
    const isSuccess = params.get("success") === "true";

    useEffect(() => {
        fetchUser().then(user => {
            setUser(user);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!isSuccess) return;
        fetchUser().then(user => {
            setUser(user);
            setLoading(false);
            router.replace('/dashboard');
        });
    }, [isSuccess, router])

    useEffect(() => {
        if (user) {
            axios.patch('/api/user', {
                user_id: user.user_id,
                data: {
                    provider_token: user.provider_token
                }
            });

        }
    }, [user])

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}