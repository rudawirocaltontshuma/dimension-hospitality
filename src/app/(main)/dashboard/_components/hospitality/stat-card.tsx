import type { LucideIcon } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  trend,
  trendPositive = true,
  className,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  trend?: string;
  trendPositive?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">{label}</CardTitle>
        <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
          {value}
        </CardDescription>
        <CardAction className="grid size-8 place-items-center rounded-md bg-muted">
          <Icon className="size-4 text-foreground" />
        </CardAction>
      </CardHeader>
      {(trend ?? hint) ? (
        <CardContent>
          <div className="text-sm">
            {trend ? (
              <span className={trendPositive ? "text-green-700 dark:text-green-300" : "text-destructive"}>{trend}</span>
            ) : null}
            {hint ? <span className="text-muted-foreground"> {hint}</span> : null}
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}
