"use client";

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { dailyArrivalsDepartures } from "@/data/hospitality";

const config = {
  arrivals: { label: "Arrivals", color: "var(--chart-1)" },
  departures: { label: "Departures", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function DailyArrivalsChart() {
  const data = dailyArrivalsDepartures(2, 6);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Daily Arrivals &amp; Departures</CardTitle>
        <CardDescription>Guest movement, this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-56 w-full">
          <BarChart data={data} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
            <YAxis hide />
            <ChartTooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} content={<ChartTooltipContent />} />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) => <span className="text-muted-foreground">{value}</span>}
            />
            <Bar dataKey="arrivals" fill="var(--color-arrivals)" radius={[4, 4, 0, 0]} barSize={12} />
            <Bar dataKey="departures" fill="var(--color-departures)" radius={[4, 4, 0, 0]} barSize={12} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
