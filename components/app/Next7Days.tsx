import { useAuth } from '@/lib/context/AuthProvider';
import { useTimer } from '@/lib/context/TimerProvider';
import { cn } from '@/lib/utils';
import { calendar_v3 } from '@googleapis/calendar';
import { Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty';
import { Separator } from '../ui/separator';
import EventList from './EventList';
import { Badge } from '../ui/badge';
import { CircleAlert } from 'lucide-react';
import { useEvents } from '@/lib/context/EventsProvider';

export default function Next7Days({
    selectedDate,
    setSelectedDate,
    colors,
}: {
    selectedDate: Date;
    setSelectedDate: Dispatch<SetStateAction<Date>>;
    colors: calendar_v3.Schema$Colors | null;
}) {
    const { user } = useAuth();
    const { events, setEvents } = useEvents();
    const currentDate = useTimer();

    return Array.from({ length: 7 }).map((_, index) => {
        const date = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000 * index));
        const isLocked = user?.plan.name === 'free' && index > 2;
        date.setHours(0, 0, 0, 0);
        const isSelected = selectedDate.setHours(0, 0, 0, 0) === date.getTime();

        return user && (
            <Card className={cn("py-0 flex-1 gap-0 duration-100", isSelected && 'ring-2 ring-violet-400', isLocked && 'pointer-events-none')} key={index} onClick={() => setSelectedDate(date)}>
                <CardHeader>
                    <CardTitle className="py-3 text-center">{date.toLocaleDateString()}</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className={cn("h-full p-3 bg-neutral-100")}>
                    {isLocked ? (
                        <Empty className="h-full">
                            <EmptyHeader>
                                <EmptyMedia variant="icon" className='ring ring-neutral-300'>
                                    <CircleAlert />
                                </EmptyMedia>
                                <EmptyTitle>Upgrade required</EmptyTitle>
                                <EmptyDescription>
                                    Peek full 7 days required{" "}
                                    <Badge className="bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300">pro</Badge>
                                    {" "}plan
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <div className="h-full overflow-y-scroll">
                            <EventList events={events} date={date} currentDate={currentDate} colors={colors} setEvents={setEvents} />
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    });
}
