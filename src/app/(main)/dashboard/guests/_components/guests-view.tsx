"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Search } from "lucide-react";

import { EntityAvatar } from "@/app/(main)/dashboard/_components/hospitality/entity-avatar";
import {
  HospitalityTable,
  type HospitalityTableColumn,
} from "@/app/(main)/dashboard/_components/hospitality/hospitality-table";
import { PageHeader } from "@/app/(main)/dashboard/_components/hospitality/page-header";
import { StatusBadge } from "@/app/(main)/dashboard/_components/hospitality/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  formatCurrency,
  formatDate,
  type Guest,
  getRoom,
  getRoomType,
  guests as initialGuests,
  reservationsForGuest,
  type VipTier,
} from "@/data/hospitality";

import { CreateGuestDialog } from "./create-guest-dialog";

const VIP_FILTERS: (VipTier | "All")[] = ["All", "None", "Silver", "Gold", "Platinum"];

type GuestRelationship = "In-house" | "Upcoming" | "Past Guest" | "No stays";

const RELATIONSHIP_META: Record<GuestRelationship, { badgeClass: string; dotClass: string }> = {
  "In-house": {
    badgeClass: "border-green-600/20 bg-green-600/10 text-green-700 dark:text-green-400",
    dotClass: "bg-green-600",
  },
  Upcoming: {
    badgeClass: "border-blue-600/20 bg-blue-600/10 text-blue-700 dark:text-blue-400",
    dotClass: "bg-blue-600",
  },
  "Past Guest": { badgeClass: "border-muted bg-muted/60 text-muted-foreground", dotClass: "bg-muted-foreground" },
  "No stays": { badgeClass: "border-muted bg-muted/60 text-muted-foreground", dotClass: "bg-muted-foreground" },
};

interface GuestRow {
  id: string;
  name: string;
  email: string;
  vipTier: VipTier;
  reservationCode: string;
  roomLabel: string;
  stayLabel: string;
  totalSpend: number;
  lastVisit: string | null;
  relationship: GuestRelationship;
  searchText: string;
}

function buildRow(guest: Guest): GuestRow {
  const guestReservations = reservationsForGuest(guest.id);
  const checkedIn = guestReservations.find((r) => r.status === "Checked In");
  const upcoming = guestReservations
    .filter((r) => r.status === "Confirmed" || r.status === "Pending")
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn))[0];
  const past = guestReservations
    .filter((r) => r.status === "Checked Out")
    .sort((a, b) => b.checkOut.localeCompare(a.checkOut))[0];

  const featured = checkedIn ?? upcoming ?? past;
  let relationship: GuestRelationship = "No stays";
  if (checkedIn) relationship = "In-house";
  else if (upcoming) relationship = "Upcoming";
  else if (past) relationship = "Past Guest";

  const room = featured ? getRoom(featured.roomId) : undefined;
  const roomType = featured ? getRoomType(featured.typeId) : undefined;

  return {
    id: guest.id,
    name: guest.name,
    email: guest.email,
    vipTier: guest.vipTier,
    reservationCode: featured?.code ?? "—",
    roomLabel: room && roomType ? `${room.number} · ${roomType.name}` : "—",
    stayLabel: featured ? `${formatDate(featured.checkIn)} – ${formatDate(featured.checkOut)}` : "—",
    totalSpend: guest.totalSpend,
    lastVisit: guest.lastVisit,
    relationship,
    searchText: `${guest.name} ${guest.email}`.toLowerCase(),
  };
}

export function GuestsView() {
  const router = useRouter();
  const [guests, setGuests] = React.useState<Guest[]>(initialGuests);
  const [search, setSearch] = React.useState("");
  const [tier, setTier] = React.useState<(typeof VIP_FILTERS)[number]>("All");

  const rows = React.useMemo(() => guests.map(buildRow), [guests]);

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      if (tier !== "All" && row.vipTier !== tier) return false;
      if (search && !row.searchText.includes(search.toLowerCase())) return false;
      return true;
    });
  }, [rows, search, tier]);

  const columns: HospitalityTableColumn<GuestRow>[] = [
    {
      id: "guest",
      header: "Guest",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <EntityAvatar name={row.name} size="sm" />
          <div className="min-w-0">
            <div className="truncate font-medium">{row.name}</div>
            <div className="truncate text-muted-foreground text-xs">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      id: "reservation",
      header: "Reservation",
      cell: (row) => <span className="tabular-nums">{row.reservationCode}</span>,
    },
    {
      id: "room",
      header: "Room",
      cell: (row) => <span className="text-muted-foreground">{row.roomLabel}</span>,
    },
    {
      id: "stay",
      header: "Stay",
      cell: (row) => <span className="whitespace-nowrap tabular-nums">{row.stayLabel}</span>,
    },
    {
      id: "totalSpend",
      header: "Total Spend",
      cell: (row) => <span className="tabular-nums">{formatCurrency(row.totalSpend)}</span>,
    },
    {
      id: "lastVisit",
      header: "Last Visit",
      cell: (row) => <span className="tabular-nums">{row.lastVisit ? formatDate(row.lastVisit) : "Never"}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.relationship} meta={RELATIONSHIP_META[row.relationship]} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Guests"
        description="Fictional guest directory and loyalty profiles."
        actions={<CreateGuestDialog onCreate={(guest) => setGuests((prev) => [guest, ...prev])} />}
      />

      <Card>
        <CardHeader className="flex flex-col gap-3 border-b sm:flex-row sm:items-center sm:justify-between">
          <InputGroup className="h-8 sm:w-72">
            <InputGroupAddon>
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-8"
              placeholder="Search guests..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </InputGroup>

          <div className="flex items-center gap-2">
            {tier !== "All" ? (
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {filteredRows.length} results
              </Badge>
            ) : null}
            <Select value={tier} onValueChange={(value) => setTier(value as (typeof VIP_FILTERS)[number])}>
              <SelectTrigger size="sm" className="w-full sm:w-40">
                <span className="text-muted-foreground">Tier:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectGroup>
                  {VIP_FILTERS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-4 pt-4">
          <HospitalityTable
            columns={columns}
            rows={filteredRows}
            rowKey={(row) => row.id}
            onRowClick={(row) => router.push(`/dashboard/guests/${row.id}`)}
            emptyMessage="No guests match your filters."
            pageSize={12}
          />
        </CardContent>
      </Card>
    </div>
  );
}
