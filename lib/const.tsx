import { ButtonsProps } from "./types";
import { Coffee, Globe, Inbox, Rocket, Sprout, TrendingUp, Truck } from "lucide-react";

export const buttons: ButtonsProps[] = [
    {
        icon: <Rocket />,
        name: 'Deep Work',
        hours: 2,
        colorId: '9',
    },
    {
        icon: <Inbox />,
        name: 'Admin',
        hours: 1,
        colorId: '1',
    },
    {
        icon: <Sprout />,
        name: 'Learn',
        hours: 3,
        colorId: '10',
    },
    {
        icon: <Coffee />,
        name: 'Coffee Break',
        hours: .5,
        colorId: '5',
    },
    {
        icon: <Globe />,
        name: 'Networking',
        hours: 1,
        colorId: '6',
    },
    {
        icon: <TrendingUp />,
        name: 'Marketing',
        hours: 2,
        colorId: '3',
    },
    {
        icon: <Truck />,
        name: 'Ship Code',
        hours: 3,
        colorId: '7',
    },

]