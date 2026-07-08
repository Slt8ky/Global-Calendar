import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { EventColor, EventData } from "./types";
import { RefObject } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertDate(dateString: string) {
  const [y, m, d] = dateString.split('-').map(e => parseInt(e));
  const date = new Date();
  date.setFullYear(y, m, d);
  return date;
}

export function normalizeEvents(events: EventData[], colorsRef: RefObject<EventColor | null>) {
  return events.map(event => Object.fromEntries(Object.entries(event).filter(([k]) => Object.keys(['id', 'start', 'end', 'summary'].includes(k))))) as EventData[];
}