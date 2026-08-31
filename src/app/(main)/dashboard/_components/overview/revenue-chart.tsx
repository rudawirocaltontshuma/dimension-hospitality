"use client";

import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCompactCurrency, formatCurrency, revenueLast30Days, revenueTrend } from "@/data/hospitality";

const config = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  target: {
    label: "Target",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Revenue</CardTitle>
        <CardDescription className="text-2xl text-foreground tabular-nums leading-none tracking-tight">
          {formatCurrency(revenueLast30Days())}
          <span className="ml-1 text-muted-foreground text-sm">trailing 30 days</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-56 w-full">
          <ComposedChart data={revenueTrend} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
            <YAxis hide />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              content={<ChartTooltipContent formatter={(value) => formatCompactCurrency(Number(value))} />}
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[6, 6, 0, 0]} barSize={18} />
            <Line
              type="monotone"
              dataKey="target"
              stroke="var(--color-target)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
