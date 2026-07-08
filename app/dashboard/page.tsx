'use client';
import AddEventButton from "@/components/app/AddEventButton";
import Chart from "@/components/app/Chart";
import { Navigation } from "@/components/app/Navigation";
import Next7Days from "@/components/app/Next7Days";
import TotalFocusTime from "@/components/app/TotalFocusTime";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from "@/components/ui/empty";
import { buttons } from "@/lib/const";
import { useAuth } from "@/lib/context/AuthProvider";
import { calendar_v3 } from '@googleapis/calendar';
import axios from "axios";
import { CircleAlert, Clock, DollarSign, History, Link } from "lucide-react";
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Stripe from "stripe";

type Event = calendar_v3.Schema$Event;
type Colors = calendar_v3.Schema$Colors;

export const refreshProviderToken = async (provider_refresh_token: string) => {
    const { data: new_provider_token } = await axios.post('/api/refreshProviderToken', {
        provider_refresh_token
    });

    return new_provider_token;
}

export const EventDeleteIdContext = createContext<{ deleteId: string | null, setDeleteId: Dispatch<SetStateAction<string | null>> } | null>(null);

export const useEventDeleteId = () => {
    const context = useContext(EventDeleteIdContext);
    if (!context) throw new Error();
    return context;
};

export default function Page() {
    const { user, setUser } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [colors, setColors] = useState<Colors | null>(null);
    const [transactions, setTransactions] = useState<Stripe.BalanceTransaction[]>([])

    const fetchColors = useCallback(async () => {
        const provider_token = user?.provider_token;
        if (!provider_token) return;

        try {
            const { data }: { data: Colors } = await axios.get('https://www.googleapis.com/calendar/v3/colors', {
                headers: {
                    "Authorization": `Bearer ${provider_token}`,
                    "Accept": 'application/json'
                }
            });

            return data;
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

    const fetchTransactions = useCallback(async () => {
        const stripe_user_id = user?.stripe_user_id
        if (!stripe_user_id) return [];
        const { data: transactions } = await axios.get(`/api/stripe/list/${stripe_user_id}`);
        return transactions;
    }, [user])

    useEffect(() => {
        fetchColors().then(colors => colors && setColors(colors));
    }, [fetchColors]);

    useEffect(() => {
        fetchTransactions().then(transactions => setTransactions(transactions));
    }, [fetchTransactions])

    return user && (
        <div className="flex w-full h-dvh p-20 justify-center items-center">
            <div className="flex w-full h-full gap-10 flex-col">
                <Navigation />
                <div className="grid h-full gap-5" style={{
                    gridTemplateColumns: 'auto 1fr',
                    gridTemplateRows: '1fr minmax(auto, 30%)',
                }}>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Protect Your Time
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-2 flex-col">
                            {user && buttons.map((button, index) => {
                                return (
                                    <AddEventButton button={button} selectedDate={selectedDate} key={index} />
                                )
                            })}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between">
                                Your next {user.plan.view_days} day(s)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-full">
                            <div className="h-full overflow-x-scroll">
                                <div className="flex w-600 h-full p-1 pb-3 gap-3">
                                    <EventDeleteIdContext.Provider value={{ deleteId, setDeleteId }}>
                                        <Next7Days {...{ selectedDate, setSelectedDate, colors }} />
                                    </EventDeleteIdContext.Provider>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle>Command Center Analytics</CardTitle>
                        </CardHeader>
                        <CardContent className="grid h-full gap-3" style={{
                            gridTemplateColumns: 'auto 1fr',
                        }}>
                            <Card>
                                <CardContent className="flex gap-2 flex-col">
                                    <div className="flex gap-2 items-center text-neutral-600 font-bold">
                                        <div className="bg-neutral-200 rounded-md p-2">
                                            <Clock size={20} color="var(--color-neutral-800)" />
                                        </div>
                                        Total Focus Time
                                    </div>
                                    <TotalFocusTime />
                                </CardContent>
                            </Card>
                            <div className="row-span-2 h-full border rounded-lg overflow-hidden">
                                {user.plan.name === 'free' ? (
                                    <Empty className="h-full">
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon" className='ring ring-neutral-300'>
                                                <CircleAlert />
                                            </EmptyMedia>
                                            <EmptyTitle>Upgrade required</EmptyTitle>
                                            <EmptyDescription>
                                                Analytics feature is for{" "}
                                                <Badge className="bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300">pro</Badge>
                                                {" "}plan only
                                            </EmptyDescription>
                                        </EmptyHeader>
                                    </Empty>
                                ) : !user.stripe_user_id ? (
                                    <Empty className="h-full">
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon" className='ring ring-neutral-300'>
                                                <Link />
                                            </EmptyMedia>
                                            <EmptyTitle>Haven&apos;t linked Stripe</EmptyTitle>
                                            <EmptyDescription>
                                                Go to settings and link Stripe for Analytics.
                                            </EmptyDescription>
                                        </EmptyHeader>
                                    </Empty>
                                ) : !transactions.length ? (
                                    <Empty className="h-full">
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon" className='ring ring-neutral-300'>
                                                <History />
                                            </EmptyMedia>
                                            <EmptyTitle>No recent transactions</EmptyTitle>
                                            <EmptyDescription>
                                                There no transactions history founds
                                            </EmptyDescription>
                                        </EmptyHeader>
                                    </Empty>
                                ) : (
                                    <Chart transactions={transactions} />
                                )}
                            </div>
                            <Card>
                                <CardContent className="flex gap-2 flex-col">
                                    <div className="flex gap-2 items-center text-neutral-600 font-bold">
                                        <div className="bg-neutral-200 rounded-md p-2">
                                            <DollarSign size={20} color="var(--color-neutral-800)" />
                                        </div>
                                        Balance
                                    </div>
                                    {user.stripe_user_id ? (
                                        <div className="text-emerald-500 text-shadow-lg text-shadow-emerald-500/20">HKD${transactions.reduce((acc, transaction) => acc + transaction.amount, 0) / 100}</div>
                                    ) : (
                                        <div className="text-muted-foreground">You haven&apos;t setup Stripe account yet!</div>
                                    )}
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </div>
            </div >
        </div >
    )
}