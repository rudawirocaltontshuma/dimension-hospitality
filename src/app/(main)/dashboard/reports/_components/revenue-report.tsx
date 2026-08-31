import { Banknote, ConciergeBell, Percent, ReceiptText } from "lucide-react";

import { StatCard } from "@/app/(main)/dashboard/_components/hospitality/stat-card";
import { RevenueChart } from "@/app/(main)/dashboard/_components/overview/revenue-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, invoicesSummary, revenueLast30Days } from "@/data/hospitality";

export function RevenueReport() {
  const summary = invoicesSummary();
  const revenue = revenueLast30Days();
  const taxRate =
    summary.roomCharges + summary.serviceCharges > 0
      ? (summary.taxes / (summary.roomCharges + summary.serviceCharges)) * 100
      : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="Total Revenue" value={formatCurrency(revenue)} icon={Banknote} hint="trailing 30 days" />
        <StatCard label="Room Charges" value={formatCurrency(summary.roomCharges)} icon={ReceiptText} />
        <StatCard label="Service Charges" value={formatCurrency(summary.serviceCharges)} icon={ConciergeBell} />
        <StatCard label="Effective Tax Rate" value={`${taxRate.toFixed(1)}%`} icon={Percent} />
      </div>

      <RevenueChart />

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Billed Amounts</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Metric label="Paid" value={formatCurrency(summary.paid)} />
          <Metric label="Pending" value={formatCurrency(summary.pending)} />
          <Metric label="Overdue" value={formatCurrency(summary.overdue)} />
          <Metric label="Discounts Given" value={formatCurrency(summary.discounts)} />
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-medium text-lg tabular-nums">{value}</span>
    </div>
  );
}
