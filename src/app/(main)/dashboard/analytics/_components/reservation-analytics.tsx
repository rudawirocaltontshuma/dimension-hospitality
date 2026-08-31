"use client";

import { differenceInCalendarDays, parseISO } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { bookingsTrend, reservations } from "@/data/hospitality";

const LEAD_TIME_BUCKETS = [
  { label: "0-3 days", min: 0, max: 3 },
  { label: "4-7 days", min: 4, max: 7 },
  { label: "8-14 days", min: 8, max: 14 },
  { label: "15-30 days", min: 15, max: 30 },
  { label: "31+ days", min: 31, max: Number.POSITIVE_INFINITY },
];

const leadTimeData = LEAD_TIME_BUCKETS.map((bucket) => ({
  label: bucket.label,
  count: reservations.filter((r) => {
    const leadTime = differenceInCalendarDays(parseISO(r.checkIn), parseISO(r.createdAt.slice(0, 10)));
    return leadTime >= bucket.min && leadTime <= bucket.max;
  }).length,
}));

const bookingsConfig = { bookings: { label: "Bookings", color: "var(--chart-1)" } } satisfies ChartConfig;
const leadTimeConfig = { count: { label: "Reservations", color: "var(--chart-3)" } } satisfies ChartConfig;

export function ReservationAnalytics() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">New Bookings</CardTitle>
          <CardDescription>Last 14 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={bookingsConfig} className="h-64 w-full">
            <BarChart data={bookingsTrend} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
              <YAxis hide />
              <ChartTooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} content={<ChartTooltipContent />} />
              <Bar dataKey="bookings" fill="var(--color-bookings)" radius={[6, 6, 0, 0]} barSize={16} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Booking Lead Time</CardTitle>
          <CardDescription>Days between booking and check-in</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={leadTimeConfig} className="h-64 w-full">
            <BarChart data={leadTimeData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
              <YAxis hide />
              <ChartTooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
