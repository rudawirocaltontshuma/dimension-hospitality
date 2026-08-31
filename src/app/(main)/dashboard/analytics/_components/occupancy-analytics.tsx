"use client";

import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { adrTrend, occupancyRate, occupancyTrend, revParTrend } from "@/data/hospitality";

const combined = occupancyTrend.map((entry, i) => ({
  label: entry.label,
  occupancy: entry.occupancy,
  adr: adrTrend[i].adr,
  revpar: revParTrend[i].revpar,
}));

const config = {
  occupancy: { label: "Occupancy %", color: "var(--chart-1)" },
  adr: { label: "ADR ($)", color: "var(--chart-3)" },
  revpar: { label: "RevPAR ($)", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function OccupancyAnalytics() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Occupancy vs. ADR</CardTitle>
          <CardDescription>Current occupancy is {occupancyRate()}%, last 14 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="h-72 w-full">
            <ComposedChart data={combined} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" hide domain={[40, 100]} />
              <YAxis yAxisId="right" hide domain={[100, 260]} orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="occupancy"
                fill="var(--color-occupancy)"
                fillOpacity={0.15}
                stroke="var(--color-occupancy)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="adr"
                stroke="var(--color-adr)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revpar"
                stroke="var(--color-revpar)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
