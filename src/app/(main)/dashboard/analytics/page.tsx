import { PageHeader } from "@/app/(main)/dashboard/_components/hospitality/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { GuestAnalytics } from "./_components/guest-analytics";
import { HousekeepingAnalytics } from "./_components/housekeeping-analytics";
import { OccupancyAnalytics } from "./_components/occupancy-analytics";
import { ReservationAnalytics } from "./_components/reservation-analytics";
import { RevenueAnalytics } from "./_components/revenue-analytics";
import { RoomAnalytics } from "./_components/room-analytics";

const TABS = [
  { value: "occupancy", label: "Occupancy" },
  { value: "revenue", label: "Revenue" },
  { value: "rooms", label: "Rooms" },
  { value: "reservations", label: "Reservations" },
  { value: "guests", label: "Guests" },
  { value: "housekeeping", label: "Housekeeping" },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Analytics" description="Deeper trend analysis across the property." />

      <Tabs defaultValue="occupancy">
        <TabsList className="flex-wrap">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="occupancy" className="mt-4">
          <OccupancyAnalytics />
        </TabsContent>
        <TabsContent value="revenue" className="mt-4">
          <RevenueAnalytics />
        </TabsContent>
        <TabsContent value="rooms" className="mt-4">
          <RoomAnalytics />
        </TabsContent>
        <TabsContent value="reservations" className="mt-4">
          <ReservationAnalytics />
        </TabsContent>
        <TabsContent value="guests" className="mt-4">
          <GuestAnalytics />
        </TabsContent>
        <TabsContent value="housekeeping" className="mt-4">
          <HousekeepingAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
