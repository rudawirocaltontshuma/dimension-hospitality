"use client";

import Link from "next/link";

import { ArrowLeft, Award, Mail, Phone, Sparkles } from "lucide-react";

import { EntityAvatar } from "@/app/(main)/dashboard/_components/hospitality/entity-avatar";
import {
  HospitalityTable,
  type HospitalityTableColumn,
} from "@/app/(main)/dashboard/_components/hospitality/hospitality-table";
import { StatCard } from "@/app/(main)/dashboard/_components/hospitality/stat-card";
import { StatusBadge } from "@/app/(main)/dashboard/_components/hospitality/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatCurrency,
  formatDate,
  type Guest,
  getRoom,
  getRoomType,
  RESERVATION_STATUS_META,
  type Reservation,
  reservationsForGuest,
  VIP_TIER_META,
} from "@/data/hospitality";

export function GuestDetail({ guest }: { guest: Guest }) {
  const history = reservationsForGuest(guest.id).sort((a, b) => b.checkIn.localeCompare(a.checkIn));

  const columns: HospitalityTableColumn<Reservation>[] = [
    {
      id: "reservation",
      header: "Reservation",
      cell: (row) => <span className="font-medium tabular-nums">{row.code}</span>,
    },
    {
      id: "room",
      header: "Room",
      cell: (row) => {
        const room = getRoom(row.roomId);
        const roomType = getRoomType(row.typeId);
        return (
          <span className="text-muted-foreground">{room ? `${room.number} · ${roomType.name}` : roomType.name}</span>
        );
      },
    },
    {
      id: "dates",
      header: "Dates",
      cell: (row) => (
        <span className="whitespace-nowrap tabular-nums">
          {formatDate(row.checkIn)} – {formatDate(row.checkOut)}
        </span>
      ),
    },
    {
      id: "rate",
      header: "Rate",
      cell: (row) => <span className="tabular-nums">{formatCurrency(row.rate)}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} meta={RESERVATION_STATUS_META[row.status]} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/dashboard/guests"
        className="inline-flex w-fit items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to guests
      </Link>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-3 pt-2 text-center">
            <EntityAvatar name={guest.name} size="lg" className="size-16" />
            <div>
              <h1 className="text-xl tracking-tight">{guest.name}</h1>
              <p className="text-muted-foreground text-sm">{guest.nationality}</p>
            </div>
            <Badge variant="outline" className={VIP_TIER_META[guest.vipTier].badgeClass}>
              <Award className="size-3" />
              {guest.vipTier === "None" ? "Standard guest" : `${guest.vipTier} member`}
            </Badge>
            <Separator />
            <div className="flex w-full flex-col gap-2 text-left text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-3.5" />
                <span className="truncate">{guest.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-3.5" />
                <span>{guest.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="size-3.5" />
                <span>{guest.loyaltyPoints.toLocaleString()} loyalty points</span>
              </div>
            </div>
            {guest.notes ? (
              <>
                <Separator />
                <p className="text-muted-foreground text-sm">{guest.notes}</p>
              </>
            ) : null}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total Stays" value={`${guest.totalStays}`} icon={Award} />
            <StatCard label="Total Spend" value={formatCurrency(guest.totalSpend)} icon={Sparkles} />
            <StatCard
              label="Last Visit"
              value={guest.lastVisit ? formatDate(guest.lastVisit) : "Never"}
              icon={Mail}
              hint={`Guest since ${formatDate(guest.createdAt)}`}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-normal text-muted-foreground text-sm">Reservation History</CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <HospitalityTable
                columns={columns}
                rows={history}
                rowKey={(row) => row.id}
                emptyMessage="This guest has no reservations yet."
                pageSize={8}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
