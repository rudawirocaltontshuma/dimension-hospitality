import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, roomTypePerformance } from "@/data/hospitality";

export function RoomTypePerformanceCard() {
  const performance = roomTypePerformance();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Room Type Performance</CardTitle>
        <CardDescription>Occupancy and revenue by room category</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {performance.map((type) => (
          <div key={type.typeId} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-medium">{type.name}</span>
              <span className="text-muted-foreground tabular-nums">
                {type.occupied}/{type.totalRooms} rooms &middot; {formatCurrency(type.revenue)}
              </span>
            </div>
            <Progress value={type.occupancyPct} />
            <div className="text-muted-foreground text-xs tabular-nums">
              {type.occupancyPct}% occupied &middot; ADR {formatCurrency(type.adr)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
