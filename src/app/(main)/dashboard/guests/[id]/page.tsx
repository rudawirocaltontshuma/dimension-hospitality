import { notFound } from "next/navigation";

import { getGuest, guests } from "@/data/hospitality";

import { GuestDetail } from "./_components/guest-detail";

export function generateStaticParams() {
  return guests.map((guest) => ({ id: guest.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guest = getGuest(id);

  if (!guest) {
    notFound();
  }

  return <GuestDetail guest={guest} />;
}
