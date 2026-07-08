'use client';

import { buttons } from '@/lib/const';
import { useEvents } from '@/lib/context/EventsProvider';
import { useMemo } from 'react';

export default function TotalFocusTime() {
    const { events } = useEvents();

    const totalFocusTime = useMemo(() => {
        const filteredEvent = events.filter(event => {
            const eventStartDateTime = event.start?.dateTime
            const eventEndDateTime = event.end?.dateTime
            const summary = event.summary;

            if (eventStartDateTime && eventEndDateTime && summary) {
                if (new Date(eventEndDateTime).getTime() < new Date().getTime() && buttons.map(button => button.name).includes(summary)) {
                    return true;
                }
            }

            return false;
        });

        const totalFocusTime = filteredEvent.reduce((acc, event) => {
            return acc + new Date(event.end!.dateTime!).getTime() - new Date(event.start!.dateTime!).getTime();
        }, 0)

        const hours = totalFocusTime / 60 / 60 / 1000;

        return hours;
    }, [events])

    return (
        <div className="text-emerald-500 text-shadow-lg text-shadow-emerald-500/20">{totalFocusTime}hrs</div>
    )
}
