"use client";

import { Award, Repeat, Users } from "lucide-react";

import { EntityAvatar } from "@/app/(main)/dashboard/_components/hospitality/entity-avatar";
import {
  HospitalityTable,
  type HospitalityTableColumn,
} from "@/app/(main)/dashboard/_components/hospitality/hospitality-table";
import { StatCard } from "@/app/(main)/dashboard/_components/hospitality/stat-card";
import { StatusBadge } from "@/app/(main)/dashboard/_components/hospitality/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate, type Guest, guests, VIP_TIER_META, type VipTier } from "@/data/hospitality";

const VIP_TIERS: VipTier[] = ["Platinum", "Gold", "Silver", "None"];

export function GuestReport() {
  const returning = guests.filter((g) => g.totalStays > 1).length;
  const topSpenders = [...guests].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 10);

  const columns: HospitalityTableColumn<Guest>[] = [
    {
      id: "guest",
      header: "Guest",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <EntityAvatar name={row.name} size="sm" />
          <span className="truncate">{row.name}</span>
        </div>
      ),
    },
    {
      id: "tier",
      header: "Tier",
      cell: (row) => <StatusBadge status={row.vipTier} meta={VIP_TIER_META[row.vipTier]} />,
    },
    { id: "stays", header: "Stays", cell: (row) => <span className="tabular-nums">{row.totalStays}</span> },
    {
      id: "spend",
      header: "Total Spend",
      cell: (row) => <span className="tabular-nums">{formatCurrency(row.totalSpend)}</span>,
    },
    {
      id: "lastVisit",
      header: "Last Visit",
      cell: (row) => <span className="tabular-nums">{row.lastVisit ? formatDate(row.lastVisit) : "Never"}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Guests" value={`${guests.length}`} icon={Users} />
        <StatCard label="Returning Guests" value={`${returning}`} icon={Repeat} />
        <StatCard label="VIP Members" value={`${guests.filter((g) => g.vipTier !== "None").length}`} icon={Award} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Loyalty Tier Distribution</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {VIP_TIERS.map((tier) => (
            <div key={tier} className="flex flex-col gap-2 rounded-lg border p-3">
              <StatusBadge status={tier} meta={VIP_TIER_META[tier]} />
              <div className="font-medium text-2xl tabular-nums">{guests.filter((g) => g.vipTier === tier).length}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Top Guests by Spend</CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <HospitalityTable columns={columns} rows={topSpenders} rowKey={(row) => row.id} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}
