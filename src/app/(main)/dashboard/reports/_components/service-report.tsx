"use client";

import { Star } from "lucide-react";

import {
  HospitalityTable,
  type HospitalityTableColumn,
} from "@/app/(main)/dashboard/_components/hospitality/hospitality-table";
import { StatusBadge } from "@/app/(main)/dashboard/_components/hospitality/status-badge";
import { ServiceIcon } from "@/app/(main)/dashboard/services/_components/service-icon";
import { ServicesRevenueChart } from "@/app/(main)/dashboard/services/_components/services-revenue-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, type HotelService, SERVICE_STATUS_META, services } from "@/data/hospitality";

export function ServiceReport() {
  const columns: HospitalityTableColumn<HotelService>[] = [
    {
      id: "service",
      header: "Service",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 shrink-0 place-items-center rounded-md bg-muted">
            <ServiceIcon icon={row.icon} className="size-4" />
          </div>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { id: "requests", header: "Requests", cell: (row) => <span className="tabular-nums">{row.requests30d}</span> },
    {
      id: "revenue",
      header: "Revenue",
      cell: (row) => <span className="tabular-nums">{formatCurrency(row.revenue30d)}</span>,
    },
    {
      id: "rating",
      header: "Rating",
      cell: (row) => (
        <span className="flex items-center gap-1 tabular-nums">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          {row.avgRating.toFixed(1)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} meta={SERVICE_STATUS_META[row.status]} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <ServicesRevenueChart />
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Service Performance</CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <HospitalityTable columns={columns} rows={services} rowKey={(row) => row.id} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}
