import { notFound } from "next/navigation";

import { getReservation, reservations } from "@/data/hospitality";

import { ReservationDetail } from "./_components/reservation-detail";

export function generateStaticParams() {
  return reservations.map((reservation) => ({ id: reservation.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reservation = getReservation(id);

  if (!reservation) {
    notFound();
  }

  return <ReservationDetail reservation={reservation} />;
}
