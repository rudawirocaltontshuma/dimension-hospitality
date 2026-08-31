"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cleaningHistory } from "@/data/hospitality";

const config = {
  roomsCleaned: { label: "Rooms cleaned", color: "var(--chart-1)" },
  inspected: { label: "Inspected", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function CleaningTrendChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Cleaning Throughput</CardTitle>
        <CardDescription>Rooms cleaned and inspected, last 14 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-56 w-full">
          <LineChart data={cleaningHistory} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              tickFormatter={(value: string) => value.slice(5)}
            />
            <YAxis hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="roomsCleaned"
              stroke="var(--color-roomsCleaned)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="inspected"
              stroke="var(--color-inspected)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
