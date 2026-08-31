"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { type HousekeepingPriority, housekeepingTasks, housekeepingTurnaroundTrend } from "@/data/hospitality";

const turnaroundConfig = { minutes: { label: "Avg. minutes", color: "var(--chart-1)" } } satisfies ChartConfig;
const priorityConfig = { count: { label: "Rooms", color: "var(--chart-5)" } } satisfies ChartConfig;

const PRIORITY_ORDER: HousekeepingPriority[] = ["Low", "Medium", "High", "Urgent"];

const priorityData = PRIORITY_ORDER.map((priority) => ({
  priority,
  count: housekeepingTasks.filter((task) => task.priority === priority).length,
}));

export function HousekeepingAnalytics() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Cleaning Turnaround Time</CardTitle>
          <CardDescription>Average minutes per room, last 14 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={turnaroundConfig} className="h-64 w-full">
            <LineChart data={housekeepingTurnaroundTrend} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="minutes" stroke="var(--color-minutes)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Task Priority Mix</CardTitle>
          <CardDescription>Open housekeeping tasks by priority</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={priorityConfig} className="h-64 w-full">
            <BarChart data={priorityData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="priority" axisLine={false} tickLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
              <YAxis hide />
              <ChartTooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
