"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { guestSatisfactionTrend, guests } from "@/data/hospitality";

const satisfactionConfig = { score: { label: "Satisfaction", color: "var(--chart-2)" } } satisfies ChartConfig;
const nationalityConfig = { count: { label: "Guests", color: "var(--chart-4)" } } satisfies ChartConfig;

const nationalityData = Object.entries(
  guests.reduce<Record<string, number>>((acc, guest) => {
    acc[guest.nationality] = (acc[guest.nationality] ?? 0) + 1;
    return acc;
  }, {}),
)
  .map(([nationality, count]) => ({ nationality, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 8);

export function GuestAnalytics() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Guest Satisfaction</CardTitle>
          <CardDescription>Average survey score, out of 5</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={satisfactionConfig} className="h-64 w-full">
            <LineChart data={guestSatisfactionTrend} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
              <YAxis hide domain={[3.5, 5]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Guests by Nationality</CardTitle>
          <CardDescription>Top 8 countries of origin</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={nationalityConfig} className="h-64 w-full">
            <BarChart data={nationalityData} layout="vertical" margin={{ left: 0, right: 12, top: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="nationality"
                type="category"
                width={90}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[0, 6, 6, 0]} barSize={14} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
