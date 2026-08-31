"use client";

import * as React from "react";

import { AlertOctagon, CheckCircle2, ClipboardList, Search, Wrench } from "lucide-react";

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
import {
  formatDate,
  getRoom,
  getStaffMember,
  MAINTENANCE_PRIORITY_META,
  MAINTENANCE_STATUS_META,
  type MaintenanceIssue,
  type MaintenanceStatus,
  maintenanceIssues,
} from "@/data/hospitality";

const STATUS_FILTERS: (MaintenanceStatus | "All")[] = ["All", "Reported", "Assigned", "In Progress", "Completed"];

export function MaintenanceView() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<(typeof STATUS_FILTERS)[number]>("All");

  const counts = React.useMemo(() => {
    const base: Record<MaintenanceStatus, number> = { Reported: 0, Assigned: 0, "In Progress": 0, Completed: 0 };
    for (const issue of maintenanceIssues) base[issue.status]++;
    return base;
  }, []);

  const filteredIssues = React.useMemo(() => {
    return maintenanceIssues.filter((issue) => {
      if (status !== "All" && issue.status !== status) return false;
      if (search) {
        const room = getRoom(issue.roomId);
        const haystack = `${issue.title} ${room?.number ?? ""} ${issue.category}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [search, status]);

  const columns: HospitalityTableColumn<MaintenanceIssue>[] = [
    {
      id: "issue",
      header: "Issue",
      cell: (row) => (
        <div>
          <div className="font-medium">{row.title}</div>
          <div className="text-muted-foreground text-xs">{row.category}</div>
        </div>
      ),
    },
    {
      id: "room",
      header: "Room",
      cell: (row) => <span>{getRoom(row.roomId)?.number ?? "—"}</span>,
    },
    {
      id: "priority",
      header: "Priority",
      cell: (row) => <StatusBadge status={row.priority} meta={MAINTENANCE_PRIORITY_META[row.priority]} />,
    },
    {
      id: "assigned",
      header: "Assigned Staff",
      cell: (row) => {
        const staff = getStaffMember(row.assignedStaffId);
        return staff ? (
          <div className="flex items-center gap-2">
            <EntityAvatar name={staff.name} size="sm" />
            <span className="truncate">{staff.name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">Unassigned</span>
        );
      },
    },
    {
      id: "date",
      header: "Date",
      cell: (row) => <span className="tabular-nums">{formatDate(row.dateReported)}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} meta={MAINTENANCE_STATUS_META[row.status]} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Maintenance" description="Track and resolve property maintenance issues." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Reported" value={`${counts.Reported}`} icon={AlertOctagon} />
        <StatCard label="Assigned" value={`${counts.Assigned}`} icon={ClipboardList} />
        <StatCard label="In Progress" value={`${counts["In Progress"]}`} icon={Wrench} />
        <StatCard label="Completed" value={`${counts.Completed}`} icon={CheckCircle2} />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 border-b sm:flex-row sm:items-center sm:justify-between">
          <InputGroup className="h-8 sm:w-72">
            <InputGroupAddon>
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-8"
              placeholder="Search issues, rooms, categories..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </InputGroup>
          <Select value={status} onValueChange={(value) => setStatus(value as (typeof STATUS_FILTERS)[number])}>
            <SelectTrigger size="sm" className="w-full sm:w-44">
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
            rows={filteredIssues}
            rowKey={(row) => row.id}
            emptyMessage="No maintenance issues match your filters."
            pageSize={12}
          />
        </CardContent>
      </Card>
    </div>
  );
}
