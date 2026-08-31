"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { occupancyRate, occupancyTrend } from "@/data/hospitality";

const config = {
  occupancy: {
    label: "Occupancy",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function OccupancyTrendChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Occupancy Trend</CardTitle>
        <CardDescription className="text-2xl text-foreground tabular-nums leading-none tracking-tight">
          {occupancyRate()}%<span className="ml-1 text-muted-foreground text-sm">last 14 days</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-56 w-full">
          <AreaChart data={occupancyTrend} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="occupancy-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-occupancy)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-occupancy)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              tick={{ fontSize: 11 }}
            />
            <YAxis hide domain={[40, 100]} />
            <ChartTooltip
              cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
              content={<ChartTooltipContent formatter={(value) => `${value}% occupied`} />}
            />
            <Area
              type="monotone"
              dataKey="occupancy"
              stroke="var(--color-occupancy)"
              fill="url(#occupancy-fill)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "var(--background)", stroke: "var(--color-occupancy)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
