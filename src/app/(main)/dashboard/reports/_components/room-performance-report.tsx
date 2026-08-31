"use client";

import {
  HospitalityTable,
  type HospitalityTableColumn,
} from "@/app/(main)/dashboard/_components/hospitality/hospitality-table";
import { RoomTypePerformanceCard } from "@/app/(main)/dashboard/_components/overview/room-type-performance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, type RoomTypePerformanceEntry, roomTypePerformance } from "@/data/hospitality";

export function RoomPerformanceReport() {
  const performance = roomTypePerformance();

  const columns: HospitalityTableColumn<RoomTypePerformanceEntry>[] = [
    { id: "name", header: "Room Type", cell: (row) => <span className="font-medium">{row.name}</span> },
    { id: "rooms", header: "Rooms", cell: (row) => <span className="tabular-nums">{row.totalRooms}</span> },
    {
      id: "occupancy",
      header: "Occupancy",
      cell: (row) => (
        <span className="tabular-nums">
          {row.occupied}/{row.totalRooms} ({row.occupancyPct}%)
        </span>
      ),
    },
    { id: "adr", header: "ADR", cell: (row) => <span className="tabular-nums">{formatCurrency(row.adr)}</span> },
    {
      id: "revenue",
      header: "Revenue",
      cell: (row) => <span className="tabular-nums">{formatCurrency(row.revenue)}</span>,
    },
    { id: "bookings", header: "Bookings", cell: (row) => <span className="tabular-nums">{row.bookings}</span> },
  ];

  return (
    <div className="flex flex-col gap-4">
      <RoomTypePerformanceCard />
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Room Type Detail</CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <HospitalityTable columns={columns} rows={performance} rowKey={(row) => row.typeId} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}
