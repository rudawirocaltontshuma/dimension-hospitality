"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cancellationRateTrend, formatCurrency, reservations, revenueForReservation } from "@/data/hospitality";

const config = {
  revenue: { label: "Revenue", color: "var(--chart-2)" },
} satisfies ChartConfig;

const rateConfig = {
  rate: { label: "Cancellation rate", color: "var(--destructive)" },
} satisfies ChartConfig;

const revenueBySource = Object.entries(
  reservations.reduce<Record<string, number>>((acc, r) => {
    if (r.status !== "Checked In" && r.status !== "Checked Out") return acc;
    acc[r.source] = (acc[r.source] ?? 0) + revenueForReservation(r.id);
    return acc;
  }, {}),
)
  .map(([source, revenue]) => ({ source, revenue }))
  .sort((a, b) => b.revenue - a.revenue);

export function RevenueAnalytics() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Revenue by Channel</CardTitle>
          <CardDescription>Realized revenue from checked-in and checked-out stays</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="h-64 w-full">
            <BarChart data={revenueBySource} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="source" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
              <YAxis hide />
              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[6, 6, 0, 0]} barSize={36} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Cancellation Rate</CardTitle>
          <CardDescription>Monthly trend</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={rateConfig} className="h-56 w-full">
            <LineChart data={cancellationRateTrend} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
              <Line type="monotone" dataKey="rate" stroke="var(--color-rate)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
