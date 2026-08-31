"use client";

import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { guestSourceBreakdown } from "@/data/hospitality";

const config = {
  value: { label: "Reservations" },
} satisfies ChartConfig;

const SOURCE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--muted-foreground)",
];

export function GuestSourcesChart() {
  const data = guestSourceBreakdown()
    .sort((a, b) => b.value - a.value)
    .map((entry, index) => ({ ...entry, fill: SOURCE_COLORS[index % SOURCE_COLORS.length] }));
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Guest Sources</CardTitle>
        <CardDescription>Where reservations come from</CardDescription>
      </CardHeader>
      <CardContent className="grid items-center gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
        <ChartContainer config={config} className="mx-auto aspect-square h-48">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="source" />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="source"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              cornerRadius={6}
              strokeWidth={4}
            >
              <Label
                content={({ viewBox }) => {
                  if (!(viewBox && "cx" in viewBox && "cy" in viewBox)) return null;
                  return (
                    <text dominantBaseline="middle" textAnchor="middle" x={viewBox.cx} y={viewBox.cy}>
                      <tspan className="fill-muted-foreground text-xs" x={viewBox.cx} y={(viewBox.cy ?? 0) - 8}>
                        Total
                      </tspan>
                      <tspan
                        className="fill-foreground font-medium text-lg tabular-nums"
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 14}
                      >
                        {total}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex min-w-0 flex-col gap-2.5">
          {data.map((entry) => (
            <div key={entry.source} className="flex items-center justify-between gap-2 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: entry.fill }} />
                <span className="truncate text-muted-foreground">{entry.source}</span>
              </div>
              <span className="font-medium tabular-nums">{entry.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
