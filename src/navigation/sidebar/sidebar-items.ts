import {
  BedDouble,
  BookOpenCheck,
  CalendarRange,
  ClipboardList,
  ConciergeBell,
  DoorOpen,
  Gauge,
  IdCard,
  Layers,
  LayoutDashboard,
  LogIn,
  LogOut,
  type LucideIcon,
  ReceiptText,
  Settings,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Overview",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "front-desk",
        title: "Front Desk",
        url: "/dashboard/front-desk",
        icon: DoorOpen,
      },
      {
        id: "calendar",
        title: "Calendar",
        url: "/dashboard/calendar",
        icon: CalendarRange,
      },
    ],
  },
  {
    id: 2,
    label: "Reservations",
    items: [
      {
        id: "reservations",
        title: "Reservations",
        url: "/dashboard/reservations",
        icon: BookOpenCheck,
      },
      {
        id: "check-in",
        title: "Check-in",
        url: "/dashboard/check-in",
        icon: LogIn,
      },
      {
        id: "check-out",
        title: "Check-out",
        url: "/dashboard/check-out",
        icon: LogOut,
      },
      {
        id: "guests",
        title: "Guests",
        url: "/dashboard/guests",
        icon: Users,
      },
    ],
  },
  {
    id: 3,
    label: "Property",
    items: [
      {
        id: "rooms",
        title: "Rooms",
        url: "/dashboard/rooms",
        icon: BedDouble,
      },
      {
        id: "room-types",
        title: "Room Types",
        url: "/dashboard/room-types",
        icon: Layers,
      },
      {
        id: "housekeeping",
        title: "Housekeeping",
        url: "/dashboard/housekeeping",
        icon: Sparkles,
      },
      {
        id: "maintenance",
        title: "Maintenance",
        url: "/dashboard/maintenance",
        icon: Wrench,
      },
    ],
  },
  {
    id: 4,
    label: "Revenue",
    items: [
      {
        id: "services",
        title: "Services",
        url: "/dashboard/services",
        icon: ConciergeBell,
      },
      {
        id: "billing",
        title: "Billing",
        url: "/dashboard/billing",
        icon: ReceiptText,
      },
      {
        id: "staff",
        title: "Staff",
        url: "/dashboard/staff",
        icon: IdCard,
      },
    ],
  },
  {
    id: 5,
    label: "Insights",
    items: [
      {
        id: "reports",
        title: "Reports",
        url: "/dashboard/reports",
        icon: ClipboardList,
      },
      {
        id: "analytics",
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: Gauge,
      },
      {
        id: "settings",
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];
