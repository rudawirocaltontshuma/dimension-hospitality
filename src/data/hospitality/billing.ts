import type { Rng } from "./rng";
import { daysFromToday, isoDate } from "./today";
import type { Invoice, InvoiceStatus, PaymentMethod, Reservation } from "./types";

export const TAX_RATE = 0.12;

const PAYMENT_METHODS: [PaymentMethod, number][] = [
  ["Credit Card", 0.48],
  ["Debit Card", 0.18],
  ["Corporate Account", 0.16],
  ["Bank Transfer", 0.1],
  ["Cash", 0.08],
];

export function generateInvoices(rng: Rng, reservations: Reservation[]): Invoice[] {
  const billable = reservations.filter((r) => r.status === "Checked In" || r.status === "Checked Out");

  return billable.map((reservation, index) => {
    const roomCharges = reservation.rate * reservation.nights;
    const serviceCharges = reservation.services.reduce((sum, s) => sum + s.amount, 0);
    const discount = rng.bool(0.16) ? Math.round((roomCharges + serviceCharges) * rng.float(0.03, 0.1)) : 0;
    const taxable = roomCharges + serviceCharges - discount;
    const taxes = Math.round(taxable * TAX_RATE);
    const total = taxable + taxes;

    let status: InvoiceStatus;
    if (reservation.status === "Checked Out") {
      status = rng.weightedPick<InvoiceStatus>([
        ["Paid", 0.78],
        ["Pending", 0.12],
        ["Overdue", 0.07],
        ["Refunded", 0.03],
      ]);
    } else {
      status = rng.weightedPick<InvoiceStatus>([
        ["Pending", 0.72],
        ["Paid", 0.28],
      ]);
    }

    const issuedDate = reservation.status === "Checked Out" ? reservation.checkOut : reservation.checkIn;
    const dueOffsetDays = status === "Overdue" ? -rng.int(1, 12) : rng.int(3, 14);

    return {
      id: `inv-${(3100 + index).toString()}`,
      reservationId: reservation.id,
      guestId: reservation.guestId,
      issuedDate,
      dueDate: isoDate(daysFromToday(dateOffsetFromIso(issuedDate) + dueOffsetDays)),
      roomCharges,
      serviceCharges,
      taxes,
      discount,
      total,
      status,
      paymentMethod: rng.weightedPick(PAYMENT_METHODS),
    };
  });
}

function dateOffsetFromIso(iso: string) {
  const target = new Date(iso);
  const today = new Date(2026, 7, 31);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
