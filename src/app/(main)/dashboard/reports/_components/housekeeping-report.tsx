import { StatusBadge } from "@/app/(main)/dashboard/_components/hospitality/status-badge";
import { CleaningTrendChart } from "@/app/(main)/dashboard/housekeeping/_components/cleaning-trend-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HOUSEKEEPING_STATUS_META, type HousekeepingStatus, rooms } from "@/data/hospitality";

const STATUS_ORDER: HousekeepingStatus[] = ["Clean", "Dirty", "Cleaning", "Inspected", "Maintenance"];

export function HousekeepingReport() {
  const counts = STATUS_ORDER.reduce(
    (acc, status) => {
      acc[status] = rooms.filter((room) => room.housekeeping === status).length;
      return acc;
    },
    {} as Record<HousekeepingStatus, number>,
  );

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Housekeeping Status</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {STATUS_ORDER.map((status) => (
            <div key={status} className="flex flex-col gap-2 rounded-lg border p-3">
              <StatusBadge status={status} meta={HOUSEKEEPING_STATUS_META[status]} />
              <div className="font-medium text-2xl tabular-nums">{counts[status]}</div>
            </div>
          ))}
        </CardContent>
      </Card>
      <CleaningTrendChart />
    </div>
  );
}
