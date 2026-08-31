import Link from "next/link";

import { ArrowLeft, BedDouble, CalendarDays, LogIn, LogOut, Mail, Phone, Receipt, Users } from "lucide-react";

import { EntityAvatar } from "@/app/(main)/dashboard/_components/hospitality/entity-avatar";
import { StatusBadge } from "@/app/(main)/dashboard/_components/hospitality/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getGuest,
  getInvoiceForReservation,
  getRoom,
  getRoomType,
  getService,
  INVOICE_STATUS_META,
  RESERVATION_STATUS_META,
  type Reservation,
  TAX_RATE,
  VIP_TIER_META,
} from "@/data/hospitality";

export function ReservationDetail({ reservation }: { reservation: Reservation }) {
  const guest = getGuest(reservation.guestId);
  const room = getRoom(reservation.roomId);
  const roomType = getRoomType(reservation.typeId);
  const invoice = getInvoiceForReservation(reservation.id);

  const roomCharges = reservation.rate * reservation.nights;
  const serviceCharges = reservation.services.reduce((sum, s) => sum + s.amount, 0);
  const taxes = invoice ? invoice.taxes : Math.round((roomCharges + serviceCharges) * TAX_RATE);
  const discount = invoice?.discount ?? 0;
  const total = invoice ? invoice.total : roomCharges + serviceCharges + taxes;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard/reservations"
          className="inline-flex w-fit items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to reservations
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl tracking-tight">{reservation.code}</h1>
            <StatusBadge status={reservation.status} meta={RESERVATION_STATUS_META[reservation.status]} />
          </div>

          <div className="flex items-center gap-2">
            {reservation.status === "Confirmed" || reservation.status === "Pending" ? (
              <Button asChild size="sm">
                <Link href="/dashboard/check-in">
                  <LogIn />
                  Start check-in
                </Link>
              </Button>
            ) : null}
            {reservation.status === "Checked In" ? (
              <Button asChild size="sm">
                <Link href="/dashboard/check-out">
                  <LogOut />
                  Start check-out
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-normal text-muted-foreground text-sm">Stay Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
              <DetailField icon={CalendarDays} label="Check-in" value={formatDate(reservation.checkIn)} />
              <DetailField icon={CalendarDays} label="Check-out" value={formatDate(reservation.checkOut)} />
              <DetailField icon={Users} label="Guests" value={`${reservation.adults + reservation.children}`} />
              <DetailField icon={BedDouble} label="Nights" value={`${reservation.nights}`} />
              <DetailField
                icon={BedDouble}
                label="Room"
                value={room ? `${room.number} · Floor ${room.floor}` : "Unassigned"}
              />
              <DetailField icon={BedDouble} label="Room Type" value={roomType.name} />
              <DetailField icon={Receipt} label="Rate" value={`${formatCurrency(reservation.rate)}/night`} />
              <DetailField icon={Receipt} label="Source" value={reservation.source} />
              <DetailField
                icon={CalendarDays}
                label="Booked on"
                value={formatDate(reservation.createdAt.slice(0, 10))}
              />
              {room ? <DetailField icon={BedDouble} label="View" value={room.view} /> : null}
              {reservation.notes ? (
                <div className="col-span-2 sm:col-span-4">
                  <div className="text-muted-foreground text-xs">Notes</div>
                  <div className="text-sm">{reservation.notes}</div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-normal text-muted-foreground text-sm">Services</CardTitle>
            </CardHeader>
            <CardContent>
              {reservation.services.length ? (
                <div className="flex flex-col divide-y">
                  {reservation.services.map((charge) => {
                    const service = getService(charge.serviceId);
                    return (
                      <div key={charge.id} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                        <div>
                          <div className="font-medium">{service?.name ?? "Service"}</div>
                          <div className="text-muted-foreground text-xs">
                            {formatDate(charge.date)} &middot; Qty {charge.quantity}
                          </div>
                        </div>
                        <div className="font-medium tabular-nums">{formatCurrency(charge.amount)}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No services attached to this reservation.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-normal text-muted-foreground text-sm">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col gap-4">
                {reservation.timeline.map((event, index) => (
                  <li key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                      {index < reservation.timeline.length - 1 ? (
                        <span className="w-px flex-1 bg-border" aria-hidden />
                      ) : null}
                    </div>
                    <div className="pb-1">
                      <div className="font-medium text-sm">{event.label}</div>
                      <div className="text-muted-foreground text-xs">
                        {formatDateTime(event.timestamp)} &middot; {event.actor}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-normal text-muted-foreground text-sm">Guest</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {guest ? (
                <>
                  <Link
                    href={`/dashboard/guests/${guest.id}`}
                    className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-muted/50"
                  >
                    <EntityAvatar name={guest.name} size="lg" />
                    <div className="min-w-0">
                      <div className="truncate font-medium">{guest.name}</div>
                      <div className="text-muted-foreground text-xs">{guest.nationality}</div>
                    </div>
                  </Link>
                  <Badge variant="outline" className={VIP_TIER_META[guest.vipTier].badgeClass}>
                    {guest.vipTier === "None" ? "Standard guest" : `${guest.vipTier} member`}
                  </Badge>
                  <Separator />
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="size-3.5" />
                      <span className="truncate">{guest.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="size-3.5" />
                      <span>{guest.phone}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-sm">Guest not found.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-normal text-muted-foreground text-sm">Billing Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <SummaryRow label="Room charges" value={formatCurrency(roomCharges)} />
              <SummaryRow label="Service charges" value={formatCurrency(serviceCharges)} />
              <SummaryRow label="Taxes" value={formatCurrency(taxes)} />
              {discount > 0 ? <SummaryRow label="Discount" value={`-${formatCurrency(discount)}`} /> : null}
              <Separator className="my-1" />
              <SummaryRow label="Total" value={formatCurrency(total)} bold />
              {invoice ? (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Invoice {invoice.id}</span>
                  <StatusBadge status={invoice.status} meta={INVOICE_STATUS_META[invoice.status]} />
                </div>
              ) : (
                <p className="text-muted-foreground text-xs">Invoice opens once the guest checks in.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailField({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
        <Icon className="size-3.5" />
        {label}
      </div>
      <div className="text-sm">{value}</div>
    </div>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-medium text-base tabular-nums" : "tabular-nums"}>{value}</span>
    </div>
  );
}
