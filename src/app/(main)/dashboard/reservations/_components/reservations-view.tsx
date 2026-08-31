"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Plus, Search } from "lucide-react";

import { EntityAvatar } from "@/app/(main)/dashboard/_components/hospitality/entity-avatar";
import {
  HospitalityTable,
  type HospitalityTableColumn,
} from "@/app/(main)/dashboard/_components/hospitality/hospitality-table";
import { PageHeader } from "@/app/(main)/dashboard/_components/hospitality/page-header";
import { StatusBadge } from "@/app/(main)/dashboard/_components/hospitality/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  formatCurrency,
  formatDate,
  getGuest,
  getRoom,
  getRoomType,
  RESERVATION_STATUS_META,
  type ReservationStatus,
  reservations,
} from "@/data/hospitality";

const STATUS_FILTERS: (ReservationStatus | "All")[] = [
  "All",
  "Confirmed",
  "Pending",
  "Checked In",
  "Checked Out",
  "Cancelled",
  "No-show",
];

interface ReservationRow {
  id: string;
  code: string;
  guestName: string;
  roomLabel: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  rate: number;
  nights: number;
  status: ReservationStatus;
  searchText: string;
}

const rows: ReservationRow[] = reservations.map((reservation) => {
  const guest = getGuest(reservation.guestId);
  const room = getRoom(reservation.roomId);
  const roomType = getRoomType(reservation.typeId);

  return {
    id: reservation.id,
    code: reservation.code,
    guestName: guest?.name ?? "Unknown guest",
    roomLabel: room ? `${room.number} · ${roomType.name}` : roomType.name,
    checkIn: reservation.checkIn,
    checkOut: reservation.checkOut,
    guestsCount: reservation.adults + reservation.children,
    rate: reservation.rate,
    nights: reservation.nights,
    status: reservation.status,
    searchText: `${reservation.code} ${guest?.name ?? ""} ${room?.number ?? ""}`.toLowerCase(),
  };
});

export function ReservationsView() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<(typeof STATUS_FILTERS)[number]>("All");

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      if (status !== "All" && row.status !== status) return false;
      if (search && !row.searchText.includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, status]);

  const columns: HospitalityTableColumn<ReservationRow>[] = [
    {
      id: "reservation",
      header: "Reservation",
      cell: (row) => <span className="font-medium tabular-nums">{row.code}</span>,
    },
    {
      id: "guest",
      header: "Guest",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <EntityAvatar name={row.guestName} size="sm" />
          <span className="truncate font-medium">{row.guestName}</span>
        </div>
      ),
    },
    {
      id: "room",
      header: "Room",
      cell: (row) => <span className="text-muted-foreground">{row.roomLabel}</span>,
    },
    {
      id: "checkIn",
      header: "Check-in",
      cell: (row) => <span className="tabular-nums">{formatDate(row.checkIn)}</span>,
    },
    {
      id: "checkOut",
      header: "Check-out",
      cell: (row) => <span className="tabular-nums">{formatDate(row.checkOut)}</span>,
    },
    {
      id: "guests",
      header: "Guests",
      cell: (row) => <span className="tabular-nums">{row.guestsCount}</span>,
    },
    {
      id: "rate",
      header: "Rate",
      cell: (row) => (
        <span className="tabular-nums">
          {formatCurrency(row.rate)}
          <span className="text-muted-foreground"> /night</span>
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} meta={RESERVATION_STATUS_META[row.status]} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Reservations"
        description="Every fictional booking across Dimension Hospitality Downtown."
        actions={
          <Button onClick={() => router.push("/dashboard/check-in")}>
            <Plus />
            New reservation
          </Button>
        }
      />

      <Card>
        <CardHeader className="flex flex-col gap-3 border-b sm:flex-row sm:items-center sm:justify-between">
          <InputGroup className="h-8 sm:w-72">
            <InputGroupAddon>
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-8"
              placeholder="Search by guest, code, or room..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </InputGroup>

          <Select value={status} onValueChange={(value) => setStatus(value as (typeof STATUS_FILTERS)[number])}>
            <SelectTrigger size="sm" className="w-full sm:w-44">
              <span className="text-muted-foreground">Status:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                {STATUS_FILTERS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-4 pt-4">
          <HospitalityTable
            columns={columns}
            rows={filteredRows}
            rowKey={(row) => row.id}
            onRowClick={(row) => router.push(`/dashboard/reservations/${row.id}`)}
            emptyMessage="No reservations match your filters."
            pageSize={12}
          />
        </CardContent>
      </Card>
    </div>
  );
}
