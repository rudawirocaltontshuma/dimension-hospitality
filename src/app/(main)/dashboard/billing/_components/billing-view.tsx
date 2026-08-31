"use client";

import * as React from "react";

import { AlertCircle, Banknote, CheckCircle2, Clock3, Search } from "lucide-react";

import { EntityAvatar } from "@/app/(main)/dashboard/_components/hospitality/entity-avatar";
import {
  HospitalityTable,
  type HospitalityTableColumn,
} from "@/app/(main)/dashboard/_components/hospitality/hospitality-table";
import { PageHeader } from "@/app/(main)/dashboard/_components/hospitality/page-header";
import { StatCard } from "@/app/(main)/dashboard/_components/hospitality/stat-card";
import { StatusBadge } from "@/app/(main)/dashboard/_components/hospitality/status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  formatCurrency,
  formatDate,
  getGuest,
  getReservation,
  INVOICE_STATUS_META,
  type Invoice,
  type InvoiceStatus,
  invoices,
  invoicesSummary,
} from "@/data/hospitality";

const STATUS_FILTERS: (InvoiceStatus | "All")[] = ["All", "Paid", "Pending", "Overdue", "Refunded"];

export function BillingView() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<(typeof STATUS_FILTERS)[number]>("All");
  const [selected, setSelected] = React.useState<Invoice | null>(null);

  const summary = invoicesSummary();

  const filteredInvoices = React.useMemo(() => {
    return invoices.filter((invoice) => {
      if (status !== "All" && invoice.status !== status) return false;
      if (search) {
        const guest = getGuest(invoice.guestId);
        const haystack = `${invoice.id} ${guest?.name ?? ""}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [search, status]);

  const columns: HospitalityTableColumn<Invoice>[] = [
    {
      id: "invoice",
      header: "Invoice",
      cell: (row) => <span className="font-medium tabular-nums">{row.id}</span>,
    },
    {
      id: "guest",
      header: "Guest",
      cell: (row) => {
        const guest = getGuest(row.guestId);
        return (
          <div className="flex items-center gap-2">
            <EntityAvatar name={guest?.name ?? "Guest"} size="sm" />
            <span className="truncate">{guest?.name ?? "Unknown guest"}</span>
          </div>
        );
      },
    },
    {
      id: "roomCharges",
      header: "Room Charges",
      cell: (row) => <span className="tabular-nums">{formatCurrency(row.roomCharges)}</span>,
    },
    {
      id: "serviceCharges",
      header: "Service Charges",
      cell: (row) => <span className="tabular-nums">{formatCurrency(row.serviceCharges)}</span>,
    },
    {
      id: "taxes",
      header: "Taxes",
      cell: (row) => <span className="tabular-nums">{formatCurrency(row.taxes)}</span>,
    },
    {
      id: "discount",
      header: "Discount",
      cell: (row) => <span className="tabular-nums">{row.discount ? `-${formatCurrency(row.discount)}` : "—"}</span>,
    },
    {
      id: "total",
      header: "Total",
      cell: (row) => <span className="font-medium tabular-nums">{formatCurrency(row.total)}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} meta={INVOICE_STATUS_META[row.status]} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Billing" description="Invoices, folio charges, and settlement status." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Billed" value={formatCurrency(summary.total)} icon={Banknote} />
        <StatCard label="Paid" value={formatCurrency(summary.paid)} icon={CheckCircle2} />
        <StatCard label="Pending" value={formatCurrency(summary.pending)} icon={Clock3} />
        <StatCard label="Overdue" value={formatCurrency(summary.overdue)} icon={AlertCircle} trendPositive={false} />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 border-b sm:flex-row sm:items-center sm:justify-between">
          <InputGroup className="h-8 sm:w-72">
            <InputGroupAddon>
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-8"
              placeholder="Search invoices or guests..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </InputGroup>
          <Select value={status} onValueChange={(value) => setStatus(value as (typeof STATUS_FILTERS)[number])}>
            <SelectTrigger size="sm" className="w-full sm:w-40">
              <span className="text-muted-foreground">Status:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                {STATUS_FILTERS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-4 pt-4">
          <HospitalityTable
            columns={columns}
            rows={filteredInvoices}
            rowKey={(row) => row.id}
            onRowClick={(row) => setSelected(row)}
            emptyMessage="No invoices match your filters."
            pageSize={12}
          />
        </CardContent>
      </Card>

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{selected ? `Invoice ${selected.id}` : "Invoice"}</SheetTitle>
            <SheetDescription>Folio breakdown and payment status.</SheetDescription>
          </SheetHeader>
          {selected ? <InvoiceDetail invoice={selected} /> : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function InvoiceDetail({ invoice }: { invoice: Invoice }) {
  const guest = getGuest(invoice.guestId);
  const reservation = getReservation(invoice.reservationId);

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      {guest ? (
        <div className="flex items-center gap-3">
          <EntityAvatar name={guest.name} />
          <div>
            <div className="font-medium text-sm">{guest.name}</div>
            <div className="text-muted-foreground text-xs">{guest.email}</div>
          </div>
        </div>
      ) : null}

      <Separator />

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Detail label="Reservation" value={reservation?.code ?? "—"} />
        <Detail label="Issued" value={formatDate(invoice.issuedDate)} />
        <Detail label="Due" value={formatDate(invoice.dueDate)} />
        <Detail label="Payment method" value={invoice.paymentMethod} />
      </div>

      <Separator />

      <div className="flex flex-col gap-2 text-sm">
        <Row label="Room charges" value={formatCurrency(invoice.roomCharges)} />
        <Row label="Service charges" value={formatCurrency(invoice.serviceCharges)} />
        <Row label="Taxes" value={formatCurrency(invoice.taxes)} />
        {invoice.discount > 0 ? <Row label="Discount" value={`-${formatCurrency(invoice.discount)}`} /> : null}
        <Separator className="my-1" />
        <Row label="Total" value={formatCurrency(invoice.total)} bold />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">Status</span>
        <StatusBadge status={invoice.status} meta={INVOICE_STATUS_META[invoice.status]} />
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span>{value}</span>
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
