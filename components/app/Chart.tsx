"use client"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import Stripe from "stripe"

const chartConfig = {
    amount: {
        label: "Amount",
        color: "var(--color-violet-400)",
    },
} satisfies ChartConfig

export default function Chart({ transactions }: { transactions: Stripe.BalanceTransaction[] }) {
    return (
        <ChartContainer config={chartConfig} className="w-full h-full">
            <AreaChart data={Array.from(transactions).reverse()} margin={{ top: 50 }}>
                <defs>
                    <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="var(--color-amount)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--color-amount)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="created"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={5}
                    tickFormatter={(value) => new Date(value * 1000).toLocaleString()}
                />
                <ChartTooltip
                    animationDuration={0}
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            formatter={(value) => {
                                return `HKD$${value as number / 100}`
                            }}
                            indicator="dot"
                        />
                    }
                />
                <Area
                    dataKey="amount"
                    type="natural"
                    fill="url(#fillAmount)"
                    stroke="var(--color-amount)"
                />
            </AreaChart>
        </ChartContainer>
    )
}
