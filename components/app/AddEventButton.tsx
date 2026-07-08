import { refreshProviderToken } from '@/app/dashboard/page';
import { useAuth } from '@/lib/context/AuthProvider';
import { useEvents } from '@/lib/context/EventsProvider';
import { ButtonsProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { calendar_v3 } from '@googleapis/calendar';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export default function AddEventButton({ button, selectedDate }: { button: ButtonsProps; selectedDate: Date; }) {
    const { events, setEvents } = useEvents();
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleEventAdd = async (button: ButtonsProps) => {
        if (!user) return;
        try {
            setLoading(true);

            const now = new Date()
            const isToday = new Date(now).setHours(0, 0, 0, 0) === selectedDate.setHours(0, 0, 0, 0);
            let startDateTime = isToday ? now : selectedDate;
            const durationMs = button.hours * 60 * 60 * 1000;
            let endDateTime = new Date(startDateTime.getTime() + durationMs);
            let isConflict = false;

            while (true) {
                const conflictingEvent = events.find((event) => {
                    const eventStart = event.start?.dateTime;
                    const eventEnd = event.end?.dateTime;
                    if (eventStart && eventEnd) {
                        const eventStartMs = new Date(eventStart).getTime();
                        const eventEndMs = new Date(eventEnd).getTime();
                        return eventStartMs < endDateTime.getTime() && startDateTime.getTime() < eventEndMs;
                    }
                });

                if (conflictingEvent) {
                    const eventEndMs = new Date(conflictingEvent.end!.dateTime!).getTime();
                    startDateTime = new Date(eventEndMs);
                    endDateTime = new Date(startDateTime.getTime() + durationMs);
                    isConflict = true;
                } else {
                    break;
                }
            }

            const { data } = await axios.post<calendar_v3.Schema$Event>(
                'https://www.googleapis.com/calendar/v3/calendars/primary/events',
                {
                    summary: button.name,
                    start: {
                        dateTime: new Date(startDateTime).toISOString()
                    },
                    end: {
                        dateTime: endDateTime.toISOString()
                    },
                    colorId: button.colorId,
                },
                {
                    headers: {
                        "Authorization": `Bearer ${user.provider_token}`,
                        "Accept": 'application/json',
                        "Content-Type": 'application/json'
                    }
                }
            );

            if (isConflict) {
                toast.success(`Slot busy! ${button.name} auto-shifted to ${startDateTime.getHours().toString().padStart(2, '0')}:${startDateTime.getMinutes().toString().padStart(2, '0')}.`, { position: 'top-center', style: { color: 'var(--color-emerald-500)' } })
            } else {
                toast.success(`${button.name} scheduled for ${startDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}!`, { position: 'top-center', style: { color: 'var(--color-emerald-500)' } })
            }

            setEvents(prev => [
                ...prev,
                data
            ]);
        } catch (error) {
            console.log(`${error}\nAttemping retrieve new token...`);
            setTimeout(async () => {
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
                await handleEventAdd(button);
            }, 1000);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button className={cn('hover:border-violet-400', loading && 'pointer-events-none')} variant={"outline"} onClick={() => handleEventAdd(button)}>
            <div className='flex gap-1.5 items-center' hidden={loading}>
                {button.icon}
                {button.name}
                <Badge className="text-xs">{button.hours} hrs</Badge>
            </div>
            {loading && <LoaderCircle size={16} className="animate-spin absolute" />}
        </Button>
    )
}