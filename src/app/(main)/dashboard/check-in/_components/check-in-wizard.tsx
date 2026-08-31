"use client";

import * as React from "react";

import Link from "next/link";

import { CheckCircle2, ChevronLeft, ChevronRight, LogIn, RotateCcw, Search } from "lucide-react";
import { toast } from "sonner";

import { EntityAvatar } from "@/app/(main)/dashboard/_components/hospitality/entity-avatar";
import { PageHeader } from "@/app/(main)/dashboard/_components/hospitality/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  formatCurrency,
  formatDate,
  type Guest,
  getGuest,
  getReservation,
  getRoom,
  getRoomType,
  type Reservation,
  type Room,
  reservations,
  rooms,
  SERVICES_CATALOG,
} from "@/data/hospitality";

import { type Step, Stepper } from "./stepper";

const STEPS: Step[] = [
  { id: "guest", label: "Guest" },
  { id: "reservation", label: "Reservation" },
  { id: "room", label: "Room" },
  { id: "stay", label: "Stay Details" },
  { id: "confirmation", label: "Confirmation" },
];

const ARRIVING_RESERVATIONS = reservations.filter((r) => r.status === "Confirmed" || r.status === "Pending");
const ARRIVING_GUEST_IDS = Array.from(new Set(ARRIVING_RESERVATIONS.map((r) => r.guestId)));
const ARRIVING_GUESTS = ARRIVING_GUEST_IDS.map((id) => getGuest(id)).filter((g): g is Guest => Boolean(g));

export function CheckInWizard() {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [guestId, setGuestId] = React.useState<string | null>(null);
  const [reservationId, setReservationId] = React.useState<string | null>(null);
  const [roomId, setRoomId] = React.useState<string | null>(null);
  const [adults, setAdults] = React.useState(1);
  const [children, setChildren] = React.useState(0);
  const [requests, setRequests] = React.useState("");
  const [serviceIds, setServiceIds] = React.useState<string[]>([]);
  const [completed, setCompleted] = React.useState(false);

  const guest = guestId ? getGuest(guestId) : undefined;
  const reservation = reservationId ? getReservation(reservationId) : undefined;
  const room = roomId ? getRoom(roomId) : undefined;

  function reset() {
    setStepIndex(0);
    setGuestId(null);
    setReservationId(null);
    setRoomId(null);
    setAdults(1);
    setChildren(0);
    setRequests("");
    setServiceIds([]);
    setCompleted(false);
    setSearch("");
  }

  function selectGuest(selected: Guest) {
    setGuestId(selected.id);
    const guestReservations = ARRIVING_RESERVATIONS.filter((r) => r.guestId === selected.id);
    if (guestReservations.length === 1) {
      setReservationId(guestReservations[0].id);
    } else {
      setReservationId(null);
    }
    setStepIndex(1);
  }

  function selectReservation(selected: Reservation) {
    setReservationId(selected.id);
    setRoomId(selected.roomId);
    setAdults(selected.adults);
    setChildren(selected.children);
    setStepIndex(2);
  }

  function canProceed(index: number) {
    if (index === 0) return Boolean(guestId);
    if (index === 1) return Boolean(reservationId);
    if (index === 2) return Boolean(roomId);
    return true;
  }

  function completeCheckIn() {
    setCompleted(true);
    setStepIndex(4);
    toast.success(`${guest?.name} checked in to room ${room?.number}.`, {
      description: "This is a frontend demonstration - no reservation was actually modified.",
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Check-in" description="Walk a guest through the front-desk check-in workflow." />

      <Card>
        <CardHeader className="border-b">
          <div className="overflow-x-auto pb-1">
            <Stepper steps={STEPS} currentIndex={stepIndex} />
          </div>
        </CardHeader>
        <CardContent className="flex min-h-96 flex-col gap-4 pt-4">
          {stepIndex === 0 ? (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-medium text-lg">Find the guest</h2>
                <p className="text-muted-foreground text-sm">Guests with an upcoming arrival are shown below.</p>
              </div>
              <InputGroup className="sm:w-80">
                <InputGroupAddon>
                  <Search className="size-3.5" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Search guests..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </InputGroup>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {ARRIVING_GUESTS.filter((g) => g.name.toLowerCase().includes(search.toLowerCase())).map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => selectGuest(g)}
                    className="flex items-center gap-2.5 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <EntityAvatar name={g.name} />
                    <div className="min-w-0">
                      <div className="truncate font-medium text-sm">{g.name}</div>
                      <div className="truncate text-muted-foreground text-xs">{g.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {stepIndex === 1 && guest ? (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-medium text-lg">Select the reservation</h2>
                <p className="text-muted-foreground text-sm">Reservations for {guest.name}.</p>
              </div>
              <div className="flex flex-col gap-2">
                {ARRIVING_RESERVATIONS.filter((r) => r.guestId === guest.id).map((r) => {
                  const roomType = getRoomType(r.typeId);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => selectReservation(r)}
                      className="flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="font-medium text-sm tabular-nums">{r.code}</div>
                        <div className="text-muted-foreground text-xs">
                          {roomType.name} &middot; {formatDate(r.checkIn)} - {formatDate(r.checkOut)}
                        </div>
                      </div>
                      <Badge variant="secondary">{formatCurrency(r.rate)}/night</Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {stepIndex === 2 && reservation ? (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-medium text-lg">Confirm the room</h2>
                <p className="text-muted-foreground text-sm">
                  Pre-assigned room, or choose another available {getRoomType(reservation.typeId).name.toLowerCase()}{" "}
                  room.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                {availableRoomsForType(reservation.typeId, reservation.roomId).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoomId(r.id)}
                    className={`flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
                      roomId === r.id ? "border-primary bg-muted/50" : ""
                    }`}
                  >
                    <span className="font-medium">{r.number}</span>
                    <span className="text-muted-foreground text-xs">Floor {r.floor}</span>
                    <span className="text-muted-foreground text-xs">{r.view}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {stepIndex === 3 && reservation ? (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="font-medium text-lg">Stay details</h2>
                <p className="text-muted-foreground text-sm">
                  {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)} &middot; {reservation.nights}{" "}
                  nights
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:max-w-sm">
                <div className="grid gap-1.5">
                  <Label htmlFor="adults">Adults</Label>
                  <InputGroup>
                    <InputGroupInput
                      id="adults"
                      type="number"
                      min={1}
                      value={adults}
                      onChange={(event) => setAdults(Math.max(1, Number(event.target.value)))}
                    />
                  </InputGroup>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="children">Children</Label>
                  <InputGroup>
                    <InputGroupInput
                      id="children"
                      type="number"
                      min={0}
                      value={children}
                      onChange={(event) => setChildren(Math.max(0, Number(event.target.value)))}
                    />
                  </InputGroup>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label>Add-on services</Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {SERVICES_CATALOG.map((service) => (
                    <Label
                      key={service.id}
                      htmlFor={`service-${service.id}`}
                      className="flex items-center gap-2.5 rounded-lg border p-2.5 font-normal text-sm hover:bg-muted/50"
                    >
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={serviceIds.includes(service.id)}
                        onCheckedChange={(checked) =>
                          setServiceIds((prev) =>
                            checked ? [...prev, service.id] : prev.filter((id) => id !== service.id),
                          )
                        }
                      />
                      <span className="flex-1">{service.name}</span>
                      <span className="text-muted-foreground text-xs">{formatCurrency(service.price)}</span>
                    </Label>
                  ))}
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="requests">Special requests</Label>
                <Textarea
                  id="requests"
                  rows={3}
                  placeholder="Late arrival, high floor, allergy notes..."
                  value={requests}
                  onChange={(event) => setRequests(event.target.value)}
                />
              </div>
            </div>
          ) : null}

          {stepIndex === 4 && guest && reservation && room ? (
            <div className="flex flex-col gap-4">
              {completed ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <CheckCircle2 className="size-10 text-green-600" />
                  <h2 className="font-medium text-xl">Check-in complete</h2>
                  <p className="max-w-md text-muted-foreground text-sm">
                    {guest.name} is checked into room {room.number}. This is a frontend demonstration only - no
                    reservation record was changed.
                  </p>
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    <Button variant="outline" onClick={reset}>
                      <RotateCcw />
                      Start another check-in
                    </Button>
                    <Button asChild>
                      <Link href={`/dashboard/reservations/${reservation.id}`}>View reservation</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="font-medium text-lg">Review &amp; confirm</h2>
                    <p className="text-muted-foreground text-sm">Confirm the details before completing check-in.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <SummaryBlock label="Guest">
                      <div className="flex items-center gap-2.5">
                        <EntityAvatar name={guest.name} size="sm" />
                        <span>{guest.name}</span>
                      </div>
                    </SummaryBlock>
                    <SummaryBlock label="Room">
                      {room.number} &middot; {getRoomType(reservation.typeId).name}
                    </SummaryBlock>
                    <SummaryBlock label="Stay">
                      {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)} ({reservation.nights}{" "}
                      nights)
                    </SummaryBlock>
                    <SummaryBlock label="Guests">
                      {adults} adults, {children} children
                    </SummaryBlock>
                    <SummaryBlock label="Rate">{formatCurrency(reservation.rate)}/night</SummaryBlock>
                    <SummaryBlock label="Add-on services">
                      {serviceIds.length
                        ? serviceIds.map((id) => SERVICES_CATALOG.find((s) => s.id === id)?.name).join(", ")
                        : "None"}
                    </SummaryBlock>
                  </div>
                  {requests ? <SummaryBlock label="Special requests">{requests}</SummaryBlock> : null}
                  <Separator />
                  <Button size="lg" className="w-fit" onClick={completeCheckIn}>
                    <LogIn />
                    Complete check-in
                  </Button>
                </>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {!completed ? (
        <div className="flex items-center justify-between">
          <Button variant="outline" disabled={stepIndex === 0} onClick={() => setStepIndex((i) => Math.max(0, i - 1))}>
            <ChevronLeft />
            Back
          </Button>
          {stepIndex < 3 && (
            <Button disabled={!canProceed(stepIndex)} onClick={() => setStepIndex((i) => Math.min(4, i + 1))}>
              Next
              <ChevronRight />
            </Button>
          )}
          {stepIndex === 3 && (
            <Button onClick={() => setStepIndex(4)}>
              Review
              <ChevronRight />
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}

function availableRoomsForType(typeId: Reservation["typeId"], keepRoomId: string): Room[] {
  return rooms.filter((r) => r.typeId === typeId && (r.id === keepRoomId || r.status === "Available"));
}

function SummaryBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border p-3">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="text-sm">{children}</div>
    </div>
  );
}
