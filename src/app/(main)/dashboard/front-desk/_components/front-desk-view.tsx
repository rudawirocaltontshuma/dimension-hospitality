"use client";

import * as React from "react";

import { AlertTriangle, LogIn, LogOut, ShieldAlert, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";

import { EntityAvatar } from "@/app/(main)/dashboard/_components/hospitality/entity-avatar";
import { PageHeader } from "@/app/(main)/dashboard/_components/hospitality/page-header";
import { StatCard } from "@/app/(main)/dashboard/_components/hospitality/stat-card";
import { StatusBadge } from "@/app/(main)/dashboard/_components/hospitality/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  countRoomsByStatus,
  formatDate,
  getGuest,
  getRoom,
  getRoomType,
  inHouseGuests,
  maintenanceIssues,
  occupancyRate,
  RESERVATION_STATUS_META,
  todaysArrivals,
  todaysDepartures,
} from "@/data/hospitality";

import { type GuestRequest, initialGuestRequests, type RequestStatus } from "./guest-requests";

const REQUEST_STATUSES: RequestStatus[] = ["Pending", "In Progress", "Completed"];

export function FrontDeskView() {
  const [requests, setRequests] = React.useState<GuestRequest[]>(initialGuestRequests);

  const arrivals = todaysArrivals();
  const departures = todaysDepartures();
  const inHouse = inHouseGuests();
  const roomStatusCounts = countRoomsByStatus();

  const alerts = React.useMemo(() => {
    const list: { id: string; title: string; description: string }[] = [];

    const criticalIssues = maintenanceIssues.filter(
      (issue) => (issue.priority === "Critical" || issue.priority === "High") && issue.status !== "Completed",
    );
    for (const issue of criticalIssues.slice(0, 3)) {
      const room = getRoom(issue.roomId);
      list.push({
        id: `maint-${issue.id}`,
        title: `${issue.priority} maintenance: ${issue.title}`,
        description: `Room ${room?.number ?? "—"} · reported ${formatDate(issue.dateReported)}`,
      });
    }

    const vipArrivals = arrivals.filter((r) => {
      const guest = getGuest(r.guestId);
      return guest?.vipTier === "Gold" || guest?.vipTier === "Platinum";
    });
    if (vipArrivals.length) {
      list.push({
        id: "vip-arrivals",
        title: `${vipArrivals.length} VIP arrival${vipArrivals.length > 1 ? "s" : ""} today`,
        description: "Prepare welcome amenities and priority check-in.",
      });
    }

    if (roomStatusCounts["Out of Service"] > 0) {
      list.push({
        id: "out-of-service",
        title: `${roomStatusCounts["Out of Service"]} rooms out of service`,
        description: "These rooms are excluded from tonight's availability.",
      });
    }

    if (occupancyRate() >= 90) {
      list.push({
        id: "near-full-occupancy",
        title: "Near-full occupancy",
        description: `Occupancy is at ${occupancyRate()}%. Coordinate with housekeeping on turnover speed.`,
      });
    }

    return list;
  }, [arrivals, roomStatusCounts]);

  function updateRequestStatus(id: string, status: RequestStatus) {
    setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status } : request)));
    toast.success("Request updated.");
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Front Desk" description="Live arrivals, departures, and in-house guest operations." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Arrivals Today" value={`${arrivals.length}`} icon={LogIn} />
        <StatCard label="Departures Today" value={`${departures.length}`} icon={LogOut} />
        <StatCard label="In-House Guests" value={`${inHouse.length}`} icon={Users} />
        <StatCard
          label="Open Requests"
          value={`${requests.filter((r) => r.status !== "Completed").length}`}
          icon={Sparkles}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Arrivals</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y px-4">
            {arrivals.length ? (
              arrivals.map((reservation) => {
                const guest = getGuest(reservation.guestId);
                const room = getRoom(reservation.roomId);
                return (
                  <div key={reservation.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <EntityAvatar name={guest?.name ?? "Guest"} size="sm" />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-sm">{guest?.name ?? "Unknown guest"}</div>
                        <div className="text-muted-foreground text-xs">
                          Room {room?.number ?? "TBD"} &middot; {reservation.adults + reservation.children} guests
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={reservation.status} meta={RESERVATION_STATUS_META[reservation.status]} />
                  </div>
                );
              })
            ) : (
              <p className="py-4 text-muted-foreground text-sm">No arrivals scheduled today.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Departures</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y px-4">
            {departures.length ? (
              departures.map((reservation) => {
                const guest = getGuest(reservation.guestId);
                const room = getRoom(reservation.roomId);
                return (
                  <div key={reservation.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <EntityAvatar name={guest?.name ?? "Guest"} size="sm" />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-sm">{guest?.name ?? "Unknown guest"}</div>
                        <div className="text-muted-foreground text-xs">Room {room?.number ?? "—"}</div>
                      </div>
                    </div>
                    <StatusBadge status={reservation.status} meta={RESERVATION_STATUS_META[reservation.status]} />
                  </div>
                );
              })
            ) : (
              <p className="py-4 text-muted-foreground text-sm">No departures scheduled today.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">In-House Guests</CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {inHouse.slice(0, 12).map((reservation) => {
              const guest = getGuest(reservation.guestId);
              const room = getRoom(reservation.roomId);
              const roomType = getRoomType(reservation.typeId);
              return (
                <div key={reservation.id} className="flex items-center gap-2.5 rounded-lg border p-2.5">
                  <EntityAvatar name={guest?.name ?? "Guest"} />
                  <div className="min-w-0">
                    <div className="truncate font-medium text-sm">{guest?.name ?? "Unknown guest"}</div>
                    <div className="truncate text-muted-foreground text-xs">
                      Room {room?.number} &middot; {roomType.name} &middot; until {formatDate(reservation.checkOut)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {inHouse.length > 12 ? (
            <p className="pt-3 text-muted-foreground text-xs">+{inHouse.length - 12} more guests currently in-house.</p>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Requests</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y px-4">
            {requests.map((request) => (
              <div key={request.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <div className="truncate font-medium text-sm">{request.request}</div>
                  <div className="text-muted-foreground text-xs">
                    Room {request.roomNumber} &middot; {request.requestedAt}
                  </div>
                </div>
                <Select
                  value={request.status}
                  onValueChange={(value) => updateRequestStatus(request.id, value as RequestStatus)}
                >
                  <SelectTrigger size="sm" className="w-32 shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectGroup>
                      {REQUEST_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 font-normal text-muted-foreground text-sm">
              <ShieldAlert className="size-3.5" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-4">
            {alerts.length ? (
              alerts.map((alert) => (
                <Alert key={alert.id}>
                  <AlertTriangle />
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertDescription>{alert.description}</AlertDescription>
                </Alert>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No active alerts. Operations are running smoothly.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
