"use client";

import * as React from "react";

import { CheckCircle2, LogOut, Receipt, Search } from "lucide-react";
import { toast } from "sonner";

import { EntityAvatar } from "@/app/(main)/dashboard/_components/hospitality/entity-avatar";
import { PageHeader } from "@/app/(main)/dashboard/_components/hospitality/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  formatCurrency,
  formatDate,
  getGuest,
  getRoom,
  getRoomType,
  getService,
  inHouseGuests,
  type PaymentMethod,
  type Reservation,
  TAX_RATE,
} from "@/data/hospitality";

const PAYMENT_METHODS: PaymentMethod[] = ["Credit Card", "Debit Card", "Cash", "Bank Transfer", "Corporate Account"];

export function CheckOutView() {
  const guestsDue = inHouseGuests();
  const [search, setSearch] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(guestsDue[0]?.id ?? null);
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("Credit Card");
  const [completed, setCompleted] = React.useState<Record<string, boolean>>({});

  const filtered = guestsDue.filter((reservation) => {
    const guest = getGuest(reservation.guestId);
    return guest?.name.toLowerCase().includes(search.toLowerCase());
  });

  const selected = guestsDue.find((r) => r.id === selectedId) ?? null;
  const isCompleted = selected ? Boolean(completed[selected.id]) : false;

  function processCheckOut(reservation: Reservation) {
    setCompleted((prev) => ({ ...prev, [reservation.id]: true }));
    const guest = getGuest(reservation.guestId);
    toast.success(`${guest?.name} checked out successfully.`, {
      description: "This is a frontend demonstration - no payment was processed.",
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Check-out" description="Review folio charges and complete the guest departure." />

      <div
        data-content-padding="false"
        className="grid overflow-hidden rounded-xl border lg:grid-cols-[340px_minmax(0,1fr)] lg:divide-x"
      >
        <div className="flex flex-col">
          <div className="flex flex-col gap-3 border-b p-4">
            <h2 className="font-medium">In-house guests</h2>
            <InputGroup className="h-8">
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
          </div>
          <div className="flex max-h-[36rem] flex-col gap-1 overflow-y-auto p-2 lg:max-h-[calc(100dvh-20rem)]">
            {filtered.length ? (
              filtered.map((reservation) => {
                const guest = getGuest(reservation.guestId);
                const room = getRoom(reservation.roomId);
                const done = completed[reservation.id];
                return (
                  <button
                    key={reservation.id}
                    type="button"
                    onClick={() => setSelectedId(reservation.id)}
                    className={`flex items-center gap-2.5 rounded-lg p-2.5 text-left transition-colors hover:bg-muted/50 ${
                      selectedId === reservation.id ? "bg-muted/50 ring-1 ring-primary/30" : ""
                    }`}
                  >
                    <EntityAvatar name={guest?.name ?? "Guest"} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-sm">{guest?.name ?? "Unknown guest"}</div>
                      <div className="text-muted-foreground text-xs">
                        Room {room?.number} &middot; until {formatDate(reservation.checkOut)}
                      </div>
                    </div>
                    {done ? <CheckCircle2 className="size-4 shrink-0 text-green-600" /> : null}
                  </button>
                );
              })
            ) : (
              <p className="p-4 text-muted-foreground text-sm">No guests match your search.</p>
            )}
          </div>
        </div>

        <div className="p-4">
          {selected ? (
            <CheckOutDetail
              reservation={selected}
              completed={isCompleted}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onConfirm={() => processCheckOut(selected)}
            />
          ) : (
            <div className="grid h-64 place-items-center text-muted-foreground text-sm">
              Select a guest to review their folio.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckOutDetail({
  reservation,
  completed,
  paymentMethod,
  onPaymentMethodChange,
  onConfirm,
}: {
  reservation: Reservation;
  completed: boolean;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onConfirm: () => void;
}) {
  const guest = getGuest(reservation.guestId);
  const room = getRoom(reservation.roomId);
  const roomType = getRoomType(reservation.typeId);

  const roomCharges = reservation.rate * reservation.nights;
  const serviceCharges = reservation.services.reduce((sum, s) => sum + s.amount, 0);
  const taxes = Math.round((roomCharges + serviceCharges) * TAX_RATE);
  const total = roomCharges + serviceCharges + taxes;

  if (completed) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center">
        <CheckCircle2 className="size-10 text-green-600" />
        <h2 className="font-medium text-xl">{guest?.name} checked out</h2>
        <p className="max-w-md text-muted-foreground text-sm">
          Room {room?.number} has been released to housekeeping. Folio total {formatCurrency(total)} settled via{" "}
          {paymentMethod}. No real payment was processed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <EntityAvatar name={guest?.name ?? "Guest"} size="lg" />
          <div>
            <h2 className="font-medium text-lg">{guest?.name ?? "Unknown guest"}</h2>
            <p className="text-muted-foreground text-sm">{guest?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        <Field label="Room" value={`${room?.number ?? "—"} · ${roomType.name}`} />
        <Field label="Stay" value={`${formatDate(reservation.checkIn)} – ${formatDate(reservation.checkOut)}`} />
        <Field label="Nights" value={`${reservation.nights}`} />
        <Field label="Guests" value={`${reservation.adults + reservation.children}`} />
      </div>

      <Separator />

      <div>
        <div className="mb-2 flex items-center gap-1.5 font-medium text-sm">
          <Receipt className="size-3.5" />
          Services
        </div>
        {reservation.services.length ? (
          <div className="flex flex-col divide-y">
            {reservation.services.map((charge) => (
              <div key={charge.id} className="flex items-center justify-between py-2 text-sm">
                <span>{getService(charge.serviceId)?.name ?? "Service"}</span>
                <span className="tabular-nums">{formatCurrency(charge.amount)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No additional services on this folio.</p>
        )}
      </div>

      <Separator />

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Charges</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <Row label="Room charges" value={formatCurrency(roomCharges)} />
          <Row label="Service charges" value={formatCurrency(serviceCharges)} />
          <Row label="Taxes" value={formatCurrency(taxes)} />
          <Separator className="my-1" />
          <Row label="Total" value={formatCurrency(total)} bold />
        </CardContent>
      </Card>

      <div className="grid max-w-xs gap-1.5">
        <Label htmlFor="payment-method">Payment method</Label>
        <Select value={paymentMethod} onValueChange={(value) => onPaymentMethodChange(value as PaymentMethod)}>
          <SelectTrigger id="payment-method">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PAYMENT_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button size="lg" className="w-fit" onClick={onConfirm}>
        <LogOut />
        Confirm &amp; check out
      </Button>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-medium text-base tabular-nums" : "tabular-nums"}>{value}</span>
    </div>
  );
}
