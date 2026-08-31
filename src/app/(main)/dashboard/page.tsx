import { format } from "date-fns";

import { PageHeader } from "@/app/(main)/dashboard/_components/hospitality/page-header";
import { BookingsChart } from "@/app/(main)/dashboard/_components/overview/bookings-chart";
import { DailyArrivalsChart } from "@/app/(main)/dashboard/_components/overview/daily-arrivals-chart";
import { GuestSourcesChart } from "@/app/(main)/dashboard/_components/overview/guest-sources-chart";
import { KpiGrid } from "@/app/(main)/dashboard/_components/overview/kpi-grid";
import { OccupancyTrendChart } from "@/app/(main)/dashboard/_components/overview/occupancy-chart";
import { RevenueChart } from "@/app/(main)/dashboard/_components/overview/revenue-chart";
import { RoomTypePerformanceCard } from "@/app/(main)/dashboard/_components/overview/room-type-performance";
import { TODAY } from "@/data/hospitality";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Hotel Operations"
        description={`${format(TODAY, "EEEE, do MMMM yyyy")} · Nexora Hospitality Downtown`}
      />

      <KpiGrid />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <OccupancyTrendChart />
        <RevenueChart />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <BookingsChart />
        </div>
        <div className="xl:col-span-2">
          <RoomTypePerformanceCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <GuestSourcesChart />
        <DailyArrivalsChart />
      </div>
    </div>
  );
}
