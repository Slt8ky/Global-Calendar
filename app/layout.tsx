import { AuthListener } from "@/components/app/AuthListener";
import { AuthProvider } from "@/lib/context/AuthProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner"
import { TimeProvider } from "@/lib/context/TimerProvider";
import { EventsProvider } from "@/lib/context/EventsProvider";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolopreneurHub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense>
          <TooltipProvider>
            <AuthProvider>
              <AuthListener />
              <TimeProvider>
                <EventsProvider>
                  {children}
                </EventsProvider>
              </TimeProvider>
              <Toaster />
            </AuthProvider>
          </TooltipProvider>
        </Suspense>
      </body>
    </html>
  );
}
