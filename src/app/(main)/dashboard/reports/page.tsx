import { PageHeader } from "@/app/(main)/dashboard/_components/hospitality/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { GuestReport } from "./_components/guest-report";
import { HousekeepingReport } from "./_components/housekeeping-report";
import { OccupancyReport } from "./_components/occupancy-report";
import { ReservationReport } from "./_components/reservation-report";
import { RevenueReport } from "./_components/revenue-report";
import { RoomPerformanceReport } from "./_components/room-performance-report";
import { ServiceReport } from "./_components/service-report";

const TABS = [
  { value: "occupancy", label: "Occupancy" },
  { value: "revenue", label: "Revenue" },
  { value: "reservations", label: "Reservations" },
  { value: "housekeeping", label: "Housekeeping" },
  { value: "room-performance", label: "Room Performance" },
  { value: "guests", label: "Guests" },
  { value: "services", label: "Services" },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Reports" description="Operational reports across every area of the property." />

      <Tabs defaultValue="occupancy">
        <TabsList className="flex-wrap">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="occupancy" className="mt-4">
          <OccupancyReport />
        </TabsContent>
        <TabsContent value="revenue" className="mt-4">
          <RevenueReport />
        </TabsContent>
        <TabsContent value="reservations" className="mt-4">
          <ReservationReport />
        </TabsContent>
        <TabsContent value="housekeeping" className="mt-4">
          <HousekeepingReport />
        </TabsContent>
        <TabsContent value="room-performance" className="mt-4">
          <RoomPerformanceReport />
        </TabsContent>
        <TabsContent value="guests" className="mt-4">
          <GuestReport />
        </TabsContent>
        <TabsContent value="services" className="mt-4">
          <ServiceReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
