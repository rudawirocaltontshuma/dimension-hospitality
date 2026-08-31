"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency, roomTypePerformance } from "@/data/hospitality";

const config = {
  occupancyPct: { label: "Occupancy %", color: "var(--chart-1)" },
  revenue: { label: "Revenue", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function RoomAnalytics() {
  const performance = roomTypePerformance();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Occupancy by Room Type</CardTitle>
          <CardDescription>Percent of inventory currently occupied</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="h-64 w-full">
            <BarChart data={performance} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
              <YAxis hide domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
              <Bar dataKey="occupancyPct" fill="var(--color-occupancyPct)" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Revenue by Room Type</CardTitle>
          <CardDescription>Trailing 45 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="h-64 w-full">
            <BarChart data={performance} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
              <YAxis hide />
              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
