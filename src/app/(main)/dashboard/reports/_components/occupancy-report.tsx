import { StatusBadge } from "@/app/(main)/dashboard/_components/hospitality/status-badge";
import { OccupancyTrendChart } from "@/app/(main)/dashboard/_components/overview/occupancy-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RoomStatus } from "@/data/hospitality";
import { countRoomsByStatus, ROOM_STATUS_META } from "@/data/hospitality";

const STATUS_ORDER: RoomStatus[] = ["Occupied", "Available", "Cleaning", "Maintenance", "Out of Service"];

export function OccupancyReport() {
  const counts = countRoomsByStatus();
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

  return (
    <div className="flex flex-col gap-4">
      <OccupancyTrendChart />
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Room Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {STATUS_ORDER.map((status) => (
            <div key={status} className="flex flex-col gap-2 rounded-lg border p-3">
              <StatusBadge status={status} meta={ROOM_STATUS_META[status]} />
              <div className="font-medium text-2xl tabular-nums">{counts[status]}</div>
              <div className="text-muted-foreground text-xs">
                {Math.round((counts[status] / total) * 100)}% of rooms
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
