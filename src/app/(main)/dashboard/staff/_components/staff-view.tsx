"use client";

import * as React from "react";

import { Building2, Search, TrendingUp, Users } from "lucide-react";

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
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Department, STAFF_STATUS_META, type StaffMember, type StaffStatus, staff } from "@/data/hospitality";

const DEPARTMENTS: (Department | "All")[] = [
  "All",
  "Front Desk",
  "Housekeeping",
  "Maintenance",
  "Restaurant",
  "Management",
];
const STATUS_FILTERS: (StaffStatus | "All")[] = ["All", "On Duty", "Off Duty", "On Leave"];

export function StaffView() {
  const [search, setSearch] = React.useState("");
  const [department, setDepartment] = React.useState<(typeof DEPARTMENTS)[number]>("All");
  const [status, setStatus] = React.useState<(typeof STATUS_FILTERS)[number]>("All");

  const onDutyCount = staff.filter((member) => member.status === "On Duty").length;
  const avgPerformance = Math.round(staff.reduce((sum, member) => sum + member.performance, 0) / staff.length);

  const filtered = React.useMemo(() => {
    return staff.filter((member) => {
      if (department !== "All" && member.department !== department) return false;
      if (status !== "All" && member.status !== status) return false;
      if (search && !member.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, department, status]);

  const columns: HospitalityTableColumn<StaffMember>[] = [
    {
      id: "staff",
      header: "Staff",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <EntityAvatar name={row.name} size="sm" />
          <div className="min-w-0">
            <div className="truncate font-medium">{row.name}</div>
            <div className="truncate text-muted-foreground text-xs">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      id: "department",
      header: "Department",
      cell: (row) => <span>{row.department}</span>,
    },
    {
      id: "role",
      header: "Role",
      cell: (row) => <span className="text-muted-foreground">{row.role}</span>,
    },
    {
      id: "shift",
      header: "Shift",
      cell: (row) => <span>{row.shift}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} meta={STAFF_STATUS_META[row.status]} />,
    },
    {
      id: "performance",
      header: "Performance",
      cell: (row) => (
        <div className="flex w-32 items-center gap-2">
          <Progress value={row.performance} className="h-1.5" />
          <span className="w-8 shrink-0 text-right text-xs tabular-nums">{row.performance}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Staff" description="Team directory across every department." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Staff" value={`${staff.length}`} icon={Users} />
        <StatCard label="On Duty" value={`${onDutyCount}`} icon={Users} />
        <StatCard label="Departments" value="5" icon={Building2} />
        <StatCard label="Avg. Performance" value={`${avgPerformance}`} icon={TrendingUp} />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 border-b sm:flex-row sm:items-center sm:justify-between">
          <InputGroup className="h-8 sm:w-64">
            <InputGroupAddon>
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-8"
              placeholder="Search staff..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </InputGroup>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={department} onValueChange={(value) => setDepartment(value as (typeof DEPARTMENTS)[number])}>
              <SelectTrigger size="sm" className="w-full sm:w-44">
                <span className="text-muted-foreground">Department:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectGroup>
                  {DEPARTMENTS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(value) => setStatus(value as (typeof STATUS_FILTERS)[number])}>
              <SelectTrigger size="sm" className="w-full sm:w-36">
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
          </div>
        </CardHeader>
        <CardContent className="px-4 pt-4">
          <HospitalityTable
            columns={columns}
            rows={filtered}
            rowKey={(row) => row.id}
            emptyMessage="No staff match your filters."
            pageSize={12}
          />
        </CardContent>
      </Card>
    </div>
  );
}
