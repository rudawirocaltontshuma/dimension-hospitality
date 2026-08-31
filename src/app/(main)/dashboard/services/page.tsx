import { CheckCircle2, ConciergeBell, TrendingUp } from "lucide-react";

import { PageHeader } from "@/app/(main)/dashboard/_components/hospitality/page-header";
import { StatCard } from "@/app/(main)/dashboard/_components/hospitality/stat-card";
import { formatCurrency, services } from "@/data/hospitality";

import { ServiceCard } from "./_components/service-card";
import { ServicesRevenueChart } from "./_components/services-revenue-chart";

export default function Page() {
  const totalRequests = services.reduce((sum, s) => sum + s.requests30d, 0);
  const totalRevenue = services.reduce((sum, s) => sum + s.revenue30d, 0);
  const activeCount = services.filter((s) => s.status === "Active").length;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Services" description="Guest-facing hotel services, demand, and revenue." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Requests" value={`${totalRequests}`} icon={ConciergeBell} hint="trailing 30 days" />
        <StatCard
          label="Service Revenue"
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
          hint="trailing 30 days"
        />
        <StatCard label="Active Services" value={`${activeCount} / ${services.length}`} icon={CheckCircle2} />
      </div>

      <ServicesRevenueChart />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
