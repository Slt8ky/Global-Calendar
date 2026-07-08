'use client';

import RemoveEventButton from "@/components/app/RemoveEventButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, convertDate } from '@/lib/utils';
import { calendar_v3 } from '@googleapis/calendar';
import { ArrowBigRightDash, CalendarDays } from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";

export default function EventList({
    events,
    setEvents,
    date,
    currentDate,
    colors
}: {
    events: calendar_v3.Schema$Event[];
    setEvents: Dispatch<SetStateAction<calendar_v3.Schema$Event[]>>;
    date: Date;
    currentDate: Date;
    colors: calendar_v3.Schema$Colors | null;
}) {
    const processedEvents = useMemo(() => {
        if (!colors) return;
        
        return events
            .filter(({ start, end }) => {
                if (start?.dateTime && end?.dateTime) {
                    const startDate = new Date(start.dateTime);
                    const endDate = new Date(end.dateTime);
                    startDate.setHours(0, 0, 0, 0);
                    endDate.setHours(0, 0, 0, 0);
                    return startDate <= date && date <= endDate;
                } else if (start?.date && end?.date) {
                    const startDate = convertDate(start.date);
                    const endDate = convertDate(end.date);
                    return startDate <= date && date <= new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
                }
            })
            .sort((a, b) => {
                if (a?.start?.dateTime && b?.start?.dateTime) {
                    return new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime();
                } else if (a?.start?.date && b?.start?.date) {
                    return convertDate(a.start.date).getTime() - convertDate(b.start.date).getTime();
                } else {
                    return 0;
                }
            })
            .map((event, index) => {
                let isNowEvent = false;
                const startDateTime = event.start?.dateTime;
                const endDateTime = event.end?.dateTime;
                const startDate = event.start?.date;
                const endDate = event.end?.date;

                const hasDateTime = startDateTime && endDateTime;
                const hasDate = startDate && endDate;
                if (hasDateTime) {
                    isNowEvent = new Date(startDateTime) <= currentDate && currentDate <= new Date(endDateTime)
                } else if (hasDate) {
                    isNowEvent = new Date(startDate) <= currentDate && currentDate <= new Date(endDate)
                }
                return (
                    <Tooltip key={index}>
                        <TooltipTrigger>
                            <Card className={cn("py-2", isNowEvent && "border border-emerald-400")} key={index} style={{
                                color: event.colorId && colors?.event ? `${colors.event[event.colorId].background}dd` : undefined
                            }}>
                                <CardContent className="flex px-0 flex-col">
                                    <div className="flex px-3 justify-between items-center">
                                        <div className="flex gap-2">
                                            <Avatar className={isNowEvent ? 'after:border-emerald-400' : undefined}>
                                                <AvatarFallback>
                                                    {isNowEvent ? (
                                                        <ArrowBigRightDash size={16} color='oklch(76.5% 0.177 163.223)' />
                                                    ) : (
                                                        <CalendarDays size={16} />
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <RemoveEventButton event={event} setEvents={setEvents} />
                                        </div>
                                        <div className="text-right font-mono">
                                            {hasDateTime && (
                                                <>
                                                    <div className={cn('text-violet-500/60', isNowEvent && 'text-violet-500 text-shadow-lg text-shadow-violet-500/30')}>remaining:{(() => {
                                                        const ms = new Date(startDateTime).getTime() - new Date().getTime();
                                                        const ms_abs = Math.abs(ms);
                                                        const hours = ms_abs / 60 / 60 / 1000;
                                                        const minutes = ms_abs / 60 / 1000 % 60;
                                                        const seconds = ms_abs / 1000 % 60;
                                                        return ms < 0 ? `-${Math.round(hours).toString().padStart(2, '0')}:${Math.round(minutes).toString().padStart(2, '0')}:${Math.round(seconds).toString().padStart(2, '0')}` : ` ${Math.round(hours).toString().padStart(2, '0')}:${Math.round(minutes).toString().padStart(2, '0')}:${Math.round(seconds).toString().padStart(2, '0')}`
                                                    })()}</div>
                                                    <div className={cn('text-emerald-500/60', isNowEvent && 'text-emerald-500 text-shadow-lg text-shadow-emerald-500/30')}>start: {new Date(startDateTime).toTimeString().split(' ')[0]}</div>
                                                    <div className={cn('text-rose-500/60', isNowEvent && 'text-rose-500 text-shadow-lg text-shadow-rose-500/30')}>end: {new Date(endDateTime).toTimeString().split(' ')[0]}</div>
                                                </>
                                            )}
                                            {hasDate && (
                                                <>
                                                    <div className={cn('text-emerald-500/60', isNowEvent && 'text-emerald-500 text-shadow-lg text-shadow-emerald-500/30')}>Full Day</div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex-1 px-3 font-bold truncate">{event.summary}</div>
                                </CardContent>
                            </Card>
                        </TooltipTrigger>
                        <TooltipContent className="pointer-events-none">{event.summary}</TooltipContent>
                    </Tooltip>
                )
            })
    }, [colors, currentDate, date, events, setEvents])

    return (
        <div className="flex p-1 mr-2 gap-3 flex-col">
            {processedEvents}
        </div>
    )
}
