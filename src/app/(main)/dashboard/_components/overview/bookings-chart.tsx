"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { bookingsTrend } from "@/data/hospitality";

const config = {
  bookings: {
    label: "New bookings",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const totalBookings = bookingsTrend.reduce((sum, entry) => sum + entry.bookings, 0);

export function BookingsChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Bookings</CardTitle>
        <CardDescription className="text-2xl text-foreground tabular-nums leading-none tracking-tight">
          {totalBookings}
          <span className="ml-1 text-muted-foreground text-sm">last 14 days</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-56 w-full">
          <BarChart data={bookingsTrend} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              tick={{ fontSize: 11 }}
            />
            <YAxis hide />
            <ChartTooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} content={<ChartTooltipContent />} />
            <Bar dataKey="bookings" fill="var(--color-bookings)" radius={[6, 6, 0, 0]} barSize={16} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
