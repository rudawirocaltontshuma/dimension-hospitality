import {
  Banknote,
  BedDouble,
  BookOpenCheck,
  CalendarRange,
  ChartBar,
  CheckSquare,
  ClipboardList,
  ConciergeBell,
  DoorOpen,
  Fingerprint,
  FolderOpen,
  Forklift,
  Gauge,
  GraduationCap,
  HeartPulse,
  IdCard,
  Kanban,
  Layers,
  LayoutDashboard,
  ListTodo,
  Lock,
  LogIn,
  LogOut,
  type LucideIcon,
  Mail,
  MessageSquare,
  ReceiptText,
  Server,
  Settings,
  ShoppingBag,
  Sparkles,
  SquareArrowUpRight,
  UserRound,
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
  {
    id: 6,
    label: "Template Library",
    items: [
      {
        id: "demo-dashboards",
        title: "Demo Dashboards",
        subItems: [
          { id: "demo-default", title: "Default", url: "/dashboard/default" },
          { id: "demo-crm", title: "CRM", url: "/dashboard/crm", icon: ChartBar },
          { id: "demo-finance", title: "Finance", url: "/dashboard/finance", icon: Banknote },
          { id: "demo-productivity", title: "Productivity", url: "/dashboard/productivity", icon: ListTodo },
          { id: "demo-ecommerce", title: "E-commerce", url: "/dashboard/ecommerce", icon: ShoppingBag },
          { id: "demo-academy", title: "Academy", url: "/dashboard/academy", icon: GraduationCap },
          { id: "demo-logistics", title: "Logistics", url: "/dashboard/logistics", icon: Forklift },
          { id: "demo-infrastructure", title: "Infrastructure", url: "/dashboard/infrastructure", icon: Server },
          { id: "demo-file-manager", title: "File Manager", url: "/dashboard/file-manager", icon: FolderOpen },
          {
            id: "demo-patient-monitoring",
            title: "Patient Monitoring",
            url: "/dashboard/patient-monitoring",
            icon: HeartPulse,
          },
        ],
      },
      {
        id: "demo-pages",
        title: "Demo Pages",
        subItems: [
          { id: "demo-email", title: "Email", url: "/dashboard/mail", icon: Mail },
          { id: "demo-chat", title: "Chat", url: "/dashboard/chat", icon: MessageSquare },
          { id: "demo-kanban", title: "Kanban", url: "/dashboard/kanban", icon: Kanban },
          { id: "demo-tasks", title: "Tasks", url: "/dashboard/tasks", icon: CheckSquare },
          { id: "demo-invoice", title: "Invoice", url: "/dashboard/invoice", icon: ReceiptText },
          { id: "demo-profile", title: "Profile", url: "/dashboard/profile", icon: UserRound },
          { id: "demo-users", title: "Users", url: "/dashboard/users", icon: Users },
          { id: "demo-roles", title: "Roles", url: "/dashboard/roles", icon: Lock },
        ],
      },
      {
        id: "authentication",
        title: "Authentication",
        icon: Fingerprint,
        subItems: [
          { id: "auth-login-v1", title: "Login v1", url: "/auth/v1/login", newTab: true },
          { id: "auth-login-v2", title: "Login v2", url: "/auth/v2/login", newTab: true },
          { id: "auth-register-v1", title: "Register v1", url: "/auth/v1/register", newTab: true },
          { id: "auth-register-v2", title: "Register v2", url: "/auth/v2/register", newTab: true },
        ],
      },
      {
        id: "legacy-dashboards",
        title: "Legacy Dashboards",
        subItems: [
          { id: "legacy-default", title: "Default V1", url: "/dashboard/default-v1" },
          { id: "legacy-crm", title: "CRM V1", url: "/dashboard/crm-v1" },
          { id: "legacy-finance", title: "Finance V1", url: "/dashboard/finance-v1" },
          { id: "legacy-analytics", title: "Analytics V1", url: "/dashboard/analytics-v1" },
        ],
      },
      {
        id: "others",
        title: "Others",
        url: "/dashboard/coming-soon",
        icon: SquareArrowUpRight,
        badge: "soon",
        disabled: true,
      },
    ],
  },
];
