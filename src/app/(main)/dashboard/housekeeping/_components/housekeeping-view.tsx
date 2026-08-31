"use client";

import * as React from "react";

import { CheckCircle2, ClipboardCheck, Droplets, Sparkles, Wrench } from "lucide-react";
import { toast } from "sonner";

import { EntityAvatar } from "@/app/(main)/dashboard/_components/hospitality/entity-avatar";
import {
  HospitalityTable,
  type HospitalityTableColumn,
} from "@/app/(main)/dashboard/_components/hospitality/hospitality-table";
import { PageHeader } from "@/app/(main)/dashboard/_components/hospitality/page-header";
import { StatCard } from "@/app/(main)/dashboard/_components/hospitality/stat-card";
import { StatusBadge } from "@/app/(main)/dashboard/_components/hospitality/status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  formatDate,
  getRoom,
  getStaffMember,
  HOUSEKEEPING_PRIORITY_META,
  type HousekeepingStatus,
  type HousekeepingTask,
  housekeepingTasks as initialTasks,
  isoDate,
  rooms,
  TODAY,
} from "@/data/hospitality";

import { CleaningTrendChart } from "./cleaning-trend-chart";

const HOUSEKEEPING_STATUSES: HousekeepingStatus[] = ["Clean", "Dirty", "Cleaning", "Inspected", "Maintenance"];

const STATUS_ICONS: Record<HousekeepingStatus, typeof Sparkles> = {
  Clean: CheckCircle2,
  Dirty: Droplets,
  Cleaning: Sparkles,
  Inspected: ClipboardCheck,
  Maintenance: Wrench,
};

export function HousekeepingView() {
  const [tasks, setTasks] = React.useState<HousekeepingTask[]>(initialTasks);

  const statusCounts = React.useMemo(() => {
    const counts: Record<HousekeepingStatus, number> = {
      Clean: 0,
      Dirty: 0,
      Cleaning: 0,
      Inspected: 0,
      Maintenance: 0,
    };
    for (const room of rooms) counts[room.housekeeping]++;
    return counts;
  }, []);

  function updateStatus(taskId: string, status: HousekeepingStatus) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status, lastCleaned: status === "Clean" ? isoDate(TODAY) : task.lastCleaned }
          : task,
      ),
    );
    toast.success(`Room marked as ${status.toLowerCase()}.`);
  }

  const columns: HospitalityTableColumn<HousekeepingTask>[] = [
    {
      id: "room",
      header: "Room",
      cell: (row) => {
        const room = getRoom(row.roomId);
        return <span className="font-medium">{room?.number ?? "—"}</span>;
      },
    },
    {
      id: "housekeeper",
      header: "Housekeeper",
      cell: (row) => {
        const housekeeper = getStaffMember(row.housekeeperId);
        return housekeeper ? (
          <div className="flex items-center gap-2">
            <EntityAvatar name={housekeeper.name} size="sm" />
            <span className="truncate">{housekeeper.name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">Unassigned</span>
        );
      },
    },
    {
      id: "priority",
      header: "Priority",
      cell: (row) => <StatusBadge status={row.priority} meta={HOUSEKEEPING_PRIORITY_META[row.priority]} />,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Select value={row.status} onValueChange={(value) => updateStatus(row.id, value as HousekeepingStatus)}>
          <SelectTrigger size="sm" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {HOUSEKEEPING_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "lastCleaned",
      header: "Last Cleaned",
      cell: (row) => <span className="tabular-nums">{formatDate(row.lastCleaned)}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Housekeeping" description="Room turnover status across the property." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {HOUSEKEEPING_STATUSES.map((status) => (
          <StatCard key={status} label={status} value={`${statusCounts[status]}`} icon={STATUS_ICONS[status]} />
        ))}
      </div>

      <CleaningTrendChart />

      <Card>
        <CardHeader className="border-b">
          <h2 className="font-medium text-lg">Housekeeping Board</h2>
          <p className="text-muted-foreground text-sm">{tasks.length} rooms need attention</p>
        </CardHeader>
        <CardContent className="px-4 pt-4">
          <HospitalityTable
            columns={columns}
            rows={tasks}
            rowKey={(row) => row.id}
            emptyMessage="Every room is clean and inspected."
            pageSize={12}
          />
        </CardContent>
      </Card>
    </div>
  );
}
