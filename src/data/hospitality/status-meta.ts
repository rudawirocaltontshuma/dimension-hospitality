import type {
  Department,
  HousekeepingPriority,
  HousekeepingStatus,
  InvoiceStatus,
  MaintenancePriority,
  MaintenanceStatus,
  ReservationStatus,
  RoomStatus,
  ServiceStatus,
  StaffStatus,
  VipTier,
} from "./types";

export interface StatusMeta {
  badgeClass: string;
  dotClass: string;
}

const PALETTE = {
  green: {
    badgeClass: "border-green-600/20 bg-green-600/10 text-green-700 dark:text-green-400",
    dotClass: "bg-green-600",
  },
  blue: {
    badgeClass: "border-blue-600/20 bg-blue-600/10 text-blue-700 dark:text-blue-400",
    dotClass: "bg-blue-600",
  },
  amber: {
    badgeClass: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    dotClass: "bg-amber-500",
  },
  orange: {
    badgeClass: "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400",
    dotClass: "bg-orange-500",
  },
  red: {
    badgeClass: "border-destructive/20 bg-destructive/10 text-destructive",
    dotClass: "bg-destructive",
  },
  slate: {
    badgeClass: "border-muted bg-muted/60 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
  violet: {
    badgeClass: "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-400",
    dotClass: "bg-violet-500",
  },
} satisfies Record<string, StatusMeta>;

export const RESERVATION_STATUS_META: Record<ReservationStatus, StatusMeta> = {
  Confirmed: PALETTE.blue,
  Pending: PALETTE.amber,
  "Checked In": PALETTE.green,
  "Checked Out": PALETTE.slate,
  Cancelled: PALETTE.red,
  "No-show": PALETTE.orange,
};

export const ROOM_STATUS_META: Record<RoomStatus, StatusMeta> = {
  Available: PALETTE.green,
  Occupied: PALETTE.blue,
  Cleaning: PALETTE.amber,
  Maintenance: PALETTE.orange,
  "Out of Service": PALETTE.red,
};

export const HOUSEKEEPING_STATUS_META: Record<HousekeepingStatus, StatusMeta> = {
  Clean: PALETTE.green,
  Dirty: PALETTE.red,
  Cleaning: PALETTE.amber,
  Inspected: PALETTE.blue,
  Maintenance: PALETTE.orange,
};

export const HOUSEKEEPING_PRIORITY_META: Record<HousekeepingPriority, StatusMeta> = {
  Low: PALETTE.slate,
  Medium: PALETTE.blue,
  High: PALETTE.amber,
  Urgent: PALETTE.red,
};

export const STAFF_STATUS_META: Record<StaffStatus, StatusMeta> = {
  "On Duty": PALETTE.green,
  "Off Duty": PALETTE.slate,
  "On Leave": PALETTE.amber,
};

export const MAINTENANCE_STATUS_META: Record<MaintenanceStatus, StatusMeta> = {
  Reported: PALETTE.red,
  Assigned: PALETTE.amber,
  "In Progress": PALETTE.blue,
  Completed: PALETTE.green,
};

export const MAINTENANCE_PRIORITY_META: Record<MaintenancePriority, StatusMeta> = {
  Low: PALETTE.slate,
  Medium: PALETTE.blue,
  High: PALETTE.amber,
  Critical: PALETTE.red,
};

export const SERVICE_STATUS_META: Record<ServiceStatus, StatusMeta> = {
  Active: PALETTE.green,
  Paused: PALETTE.slate,
};

export const INVOICE_STATUS_META: Record<InvoiceStatus, StatusMeta> = {
  Paid: PALETTE.green,
  Pending: PALETTE.amber,
  Overdue: PALETTE.red,
  Refunded: PALETTE.violet,
};

export const VIP_TIER_META: Record<VipTier, StatusMeta> = {
  None: PALETTE.slate,
  Silver: PALETTE.slate,
  Gold: PALETTE.amber,
  Platinum: PALETTE.violet,
};

export const DEPARTMENT_META: Record<Department, StatusMeta> = {
  "Front Desk": PALETTE.blue,
  Housekeeping: PALETTE.amber,
  Maintenance: PALETTE.orange,
  Restaurant: PALETTE.violet,
  Management: PALETTE.green,
};
