'use client';

import { calendar_v3 } from "@googleapis/calendar";
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { refreshProviderToken } from "@/app/dashboard/page";
import axios from "axios";

const EventsContext = createContext<{
    events: calendar_v3.Schema$Event[];
    setEvents: Dispatch<SetStateAction<calendar_v3.Schema$Event[]>>;
} | null>(null);

export const useEvents = () => {
    const context = useContext(EventsContext);
    if (!context) throw new Error();
    return context;
}

export function EventsProvider({ children }: { children: ReactNode }) {
    const { user, setUser } = useAuth();
    const [events, setEvents] = useState<calendar_v3.Schema$Event[]>([]);

    const fetchEvents = useCallback(async () => {
        const provider_token = user?.provider_token;
        if (!provider_token) return;
        try {
            const { data } = await axios.get<calendar_v3.Schema$Events>('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                headers: {
                    "Authorization": `Bearer ${provider_token}`,
                    "Accept": 'application/json'
                }
            });

            const items = data?.items;

            if (items) {
                return items;
            }
        } catch (error) {
            console.log(`${error}\nAttemping retrieve new token...`);
            const new_provider_token = await refreshProviderToken(user.provider_refresh_token);
            setUser(prev => {
                if (prev) {
                    return {
                        ...prev,
                        provider_token: new_provider_token
                    }
                } else {
                    return null;
                }
            });
        }
    }, [setUser, user])

    useEffect(() => {
        const timer = setInterval(() => {
            fetchEvents().then(events => events && setEvents(events))
        }, 1000);

        return () => {
            clearInterval(timer);
        }
    }, [fetchEvents]);

    return (
        <EventsContext value={{ events, setEvents }}>
            {children}
        </EventsContext>
    )
}