'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const TimeContext = createContext<Date | null>(null);

export const useTimer = () => {
  const context = useContext(TimeContext);
  if (!context) throw new Error();
  return context;
}

export function TimeProvider({ children }: { children?: ReactNode }) {
  const [timer, setTimer] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(new Date())
    }, 1000);
    return () => clearInterval(interval);
  }, [])

  return (
    <TimeContext.Provider value={timer}>
      {children}
    </TimeContext.Provider>
  )
}
