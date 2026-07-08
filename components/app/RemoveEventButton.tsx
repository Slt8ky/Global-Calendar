import { refreshProviderToken, useEventDeleteId } from "@/app/dashboard/page";
import { useAuth } from "@/lib/context/AuthProvider";
import { cn } from "@/lib/utils";
import { calendar_v3 } from "@googleapis/calendar";
import axios from "axios";
import { LoaderCircle, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function RemoveEventButton({
    event,
    setEvents,
}: {
    event: calendar_v3.Schema$Event;
    setEvents: Dispatch<SetStateAction<calendar_v3.Schema$Event[]>>;
}) {
    const { user, setUser } = useAuth();
    const { deleteId, setDeleteId } = useEventDeleteId();

    const handleEventRemove = async () => {
        if (!user || !event?.id) return;
        try {
            setDeleteId(event.id);
            await axios.delete(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.id}`, {
                headers: {
                    "Authorization": `Bearer ${user.provider_token}`,
                    "Accept": 'application/json',
                    "Content-Type": 'application/json'
                }
            });
            toast.success("Event removed. Your calendar has been freed up.", { position: 'top-center', style: {color: 'var(--color-rose-500)'} })
            setEvents(prev => prev.filter(e => e.id !== event.id));
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
            }, 1000);
            await handleEventRemove();
        } finally {
            setDeleteId(null);
        }
    }

    return (
        <Avatar className={cn("hover:after:border-rose-400", deleteId === event.id && 'pointer-events-none')} onClick={() => handleEventRemove()} >
            <AvatarFallback>
                {
                    deleteId === event.id ? (
                        <LoaderCircle size={16} color="oklch(64.5% 0.246 16.439)" className="animate-spin" />
                    ) : (
                        <Trash2 size={16} color="oklch(64.5% 0.246 16.439)" />
                    )
                }
            </AvatarFallback>
        </Avatar>
    )
}
