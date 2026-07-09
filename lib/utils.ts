import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertDate(dateString: string) {
  const [y, m, d] = dateString.split('-').map(e => parseInt(e));
  const date = new Date();
  date.setFullYear(y, m, d);
  return date;
}