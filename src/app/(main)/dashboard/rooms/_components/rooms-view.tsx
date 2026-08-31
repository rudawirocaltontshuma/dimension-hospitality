"use client";

import * as React from "react";

import { BedDouble, Grid, Rows3, Search, Sparkles, Wrench } from "lucide-react";

import { EntityAvatar } from "@/app/(main)/dashboard/_components/hospitality/entity-avatar";
import {
  HospitalityTable,
  type HospitalityTableColumn,
} from "@/app/(main)/dashboard/_components/hospitality/hospitality-table";
import { PageHeader } from "@/app/(main)/dashboard/_components/hospitality/page-header";
import { StatusBadge } from "@/app/(main)/dashboard/_components/hospitality/status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatCurrency,
  formatDate,
  getGuest,
  getRoomType,
  HOUSEKEEPING_STATUS_META,
  MAINTENANCE_STATUS_META,
  maintenanceForRoom,
  ROOM_STATUS_META,
  type Room,
  type RoomStatus,
  reservationsForRoom,
  rooms,
  roomTypes,
} from "@/data/hospitality";

const STATUS_FILTERS: (RoomStatus | "All")[] = [
  "All",
  "Available",
  "Occupied",
  "Cleaning",
  "Maintenance",
  "Out of Service",
];

export function RoomsView() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<(typeof STATUS_FILTERS)[number]>("All");
  const [typeId, setTypeId] = React.useState<string>("All");
  const [view, setView] = React.useState<"list" | "grid">("grid");
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);

  const filteredRooms = React.useMemo(() => {
    return rooms.filter((room) => {
      if (status !== "All" && room.status !== status) return false;
      if (typeId !== "All" && room.typeId !== typeId) return false;
      if (search && !room.number.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, status, typeId]);

  const columns: HospitalityTableColumn<Room>[] = [
    {
      id: "room",
      header: "Room",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 shrink-0 place-items-center rounded-md bg-muted">
            <BedDouble className="size-4" />
          </div>
          <span className="font-medium">{row.number}</span>
        </div>
      ),
    },
    {
      id: "type",
      header: "Type",
      cell: (row) => <span>{getRoomType(row.typeId).name}</span>,
    },
    {
      id: "floor",
      header: "Floor",
      cell: (row) => <span className="tabular-nums">{row.floor}</span>,
    },
    {
      id: "rate",
      header: "Rate",
      cell: (row) => <span className="tabular-nums">{formatCurrency(row.rate)}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} meta={ROOM_STATUS_META[row.status]} />,
    },
    {
      id: "housekeeping",
      header: "Housekeeping",
      cell: (row) => <StatusBadge status={row.housekeeping} meta={HOUSEKEEPING_STATUS_META[row.housekeeping]} />,
    },
    {
      id: "occupancy",
      header: "Occupancy",
      cell: (row) => {
        const guest = getGuest(row.occupantGuestId);
        return guest ? (
          <div className="flex items-center gap-2">
            <EntityAvatar name={guest.name} size="sm" />
            <span className="truncate">{guest.name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">Vacant</span>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Rooms" description="Live inventory across every floor and room type." />

      <Card>
        <CardHeader className="flex flex-col gap-3 border-b lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <InputGroup className="h-8 sm:w-56">
              <InputGroupAddon>
                <Search className="size-3.5" />
              </InputGroupAddon>
              <InputGroupInput
                className="h-8"
                placeholder="Search room number..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </InputGroup>

            <Select value={typeId} onValueChange={setTypeId}>
              <SelectTrigger size="sm" className="w-full sm:w-40">
                <span className="text-muted-foreground">Type:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectGroup>
                  <SelectItem value="All">All</SelectItem>
                  {roomTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={(value) => setStatus(value as (typeof STATUS_FILTERS)[number])}>
              <SelectTrigger size="sm" className="w-full sm:w-44">
                <span className="text-muted-foreground">Status:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectGroup>
                  {STATUS_FILTERS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground text-sm tabular-nums">{filteredRooms.length} rooms</span>
            <Tabs value={view} onValueChange={(value) => setView(value as "list" | "grid")}>
              <TabsList>
                <TabsTrigger value="list" aria-label="List view">
                  <Rows3 />
                </TabsTrigger>
                <TabsTrigger value="grid" aria-label="Grid view">
                  <Grid />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="px-4 pt-4">
          {view === "list" ? (
            <HospitalityTable
              columns={columns}
              rows={filteredRooms}
              rowKey={(row) => row.id}
              onRowClick={(row) => setSelectedRoom(row)}
              emptyMessage="No rooms match your filters."
              pageSize={12}
            />
          ) : (
            <RoomGrid rooms={filteredRooms} onSelect={setSelectedRoom} />
          )}
        </CardContent>
      </Card>

      <Sheet open={selectedRoom !== null} onOpenChange={(open) => !open && setSelectedRoom(null)}>
        <SheetContent side="right" className="gap-0 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedRoom ? `Room ${selectedRoom.number}` : "Room details"}</SheetTitle>
            <SheetDescription>{selectedRoom ? getRoomType(selectedRoom.typeId).name : ""}</SheetDescription>
          </SheetHeader>
          {selectedRoom ? <RoomDetail room={selectedRoom} /> : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function RoomGrid({ rooms: roomList, onSelect }: { rooms: Room[]; onSelect: (room: Room) => void }) {
  if (!roomList.length) {
    return (
      <div className="grid h-32 place-items-center text-muted-foreground text-sm">No rooms match your filters.</div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {roomList.map((room) => {
        const meta = ROOM_STATUS_META[room.status];
        const guest = getGuest(room.occupantGuestId);

        return (
          <button
            key={room.id}
            type="button"
            onClick={() => onSelect(room)}
            className="flex flex-col gap-2 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{room.number}</span>
              <span className={`size-2 rounded-full ${meta.dotClass}`} />
            </div>
            <span className="text-muted-foreground text-xs">{getRoomType(room.typeId).name}</span>
            <span className="truncate text-muted-foreground text-xs">{guest ? guest.name : "Vacant"}</span>
            <span className="text-xs tabular-nums">{formatCurrency(room.rate)}/night</span>
          </button>
        );
      })}
    </div>
  );
}

function RoomDetail({ room }: { room: Room }) {
  const guest = getGuest(room.occupantGuestId);
  const roomType = getRoomType(room.typeId);
  const history = reservationsForRoom(room.id).slice(0, 5);
  const issues = maintenanceForRoom(room.id).filter((issue) => issue.status !== "Completed");

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <div className="grid grid-cols-2 gap-3">
        <InfoRow label="Status">
          <StatusBadge status={room.status} meta={ROOM_STATUS_META[room.status]} />
        </InfoRow>
        <InfoRow label="Housekeeping">
          <StatusBadge status={room.housekeeping} meta={HOUSEKEEPING_STATUS_META[room.housekeeping]} />
        </InfoRow>
        <InfoRow label="Floor" value={`${room.floor}`} />
        <InfoRow label="View" value={room.view} />
        <InfoRow label="Rate" value={`${formatCurrency(room.rate)}/night`} />
        <InfoRow label="Capacity" value={`${roomType.maxAdults} adults, ${roomType.maxChildren} children`} />
        <InfoRow label="Last cleaned" value={formatDate(room.lastCleaned)} />
      </div>

      <Separator />

      <div>
        <div className="mb-2 flex items-center gap-1.5 font-medium text-sm">
          <Sparkles className="size-3.5" />
          Occupant
        </div>
        {guest ? (
          <div className="flex items-center gap-2.5">
            <EntityAvatar name={guest.name} />
            <div>
              <div className="text-sm">{guest.name}</div>
              <div className="text-muted-foreground text-xs">{guest.nationality}</div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">This room is currently vacant.</p>
        )}
      </div>

      {issues.length ? (
        <>
          <Separator />
          <div>
            <div className="mb-2 flex items-center gap-1.5 font-medium text-sm">
              <Wrench className="size-3.5" />
              Open maintenance
            </div>
            <div className="flex flex-col gap-2">
              {issues.map((issue) => (
                <div key={issue.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate">{issue.title}</span>
                  <StatusBadge status={issue.status} meta={MAINTENANCE_STATUS_META[issue.status]} />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}

      <Separator />

      <div>
        <div className="mb-2 font-medium text-sm">Recent reservations</div>
        {history.length ? (
          <div className="flex flex-col gap-2">
            {history.map((reservation) => (
              <div key={reservation.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="tabular-nums">{reservation.code}</span>
                <span className="text-muted-foreground text-xs">
                  {formatDate(reservation.checkIn)} – {formatDate(reservation.checkOut)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No reservation history for this room.</p>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      {children ?? <span className="text-sm">{value}</span>}
    </div>
  );
}
