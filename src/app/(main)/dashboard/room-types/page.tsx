import { PageHeader } from "@/app/(main)/dashboard/_components/hospitality/page-header";
import { roomTypePerformance, roomTypes } from "@/data/hospitality";

import { RoomTypeCard } from "./_components/room-type-card";

export default function Page() {
  const performance = roomTypePerformance();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Room Types" description="Category-level inventory, pricing, and performance." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {roomTypes.map((type) => {
          const stats = performance.find((entry) => entry.typeId === type.id);
          if (!stats) return null;
          return <RoomTypeCard key={type.id} type={type} performance={stats} />;
        })}
      </div>
    </div>
  );
}
