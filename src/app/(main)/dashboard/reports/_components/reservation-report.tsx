import { StatusBadge } from "@/app/(main)/dashboard/_components/hospitality/status-badge";
import { BookingsChart } from "@/app/(main)/dashboard/_components/overview/bookings-chart";
import { GuestSourcesChart } from "@/app/(main)/dashboard/_components/overview/guest-sources-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RESERVATION_STATUS_META, type ReservationStatus, reservations } from "@/data/hospitality";

const STATUS_ORDER: ReservationStatus[] = ["Confirmed", "Pending", "Checked In", "Checked Out", "Cancelled", "No-show"];

export function ReservationReport() {
  const counts = STATUS_ORDER.reduce(
    (acc, status) => {
      acc[status] = reservations.filter((r) => r.status === status).length;
      return acc;
    },
    {} as Record<ReservationStatus, number>,
  );

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Reservations by Status</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {STATUS_ORDER.map((status) => (
            <div key={status} className="flex flex-col gap-2 rounded-lg border p-3">
              <StatusBadge status={status} meta={RESERVATION_STATUS_META[status]} />
              <div className="font-medium text-2xl tabular-nums">{counts[status]}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BookingsChart />
        <GuestSourcesChart />
      </div>
    </div>
  );
}
