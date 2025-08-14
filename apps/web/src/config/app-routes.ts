import {
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  FolderKanban,
  Home,
  type LucideIcon,
  Palette,
  Settings,
  User,
  Users,
} from "lucide-react";

export type RouteItem = {
  icon?: LucideIcon;
  id: string;
  hidden?: boolean; // Added hidden property
} & ({ href: string } | { items: RouteItem[]; defaultOpen?: boolean });

export const appRoutes: RouteItem[] = [
  {
    href: "/app",
    icon: Home,
    id: "dashboard",
  },
  {
    href: "/app/clients",
    icon: Users,
    id: "clients",
  },
  {
    href: "/app/projects",
    icon: FolderKanban,
    id: "projects",
  },
  {
    href: "/app/time-tracker",
    icon: Clock,
    id: "timeTracker",
  },
  {
    href: "/app/invoices",
    icon: FileText,
    id: "invoices",
  },
  {
    href: "/app/reports",
    icon: BarChart3,
    id: "statistics",
  },
  {
    href: "/app/calendar",
    icon: Calendar,
    id: "calendar",
  },
  {
    icon: Settings,
    id: "settings",
    items: [
      {
        href: "/app/settings/user",
        id: "settings/user",
        icon: User,
      },
      {
        href: "/app/settings/billing",
        id: "settings/billing",
        icon: DollarSign,
      },
      {
        href: "/app/settings/appearance",
        id: "settings/appearance",
        icon: Palette,
      },
    ],
    defaultOpen: false,
  },
];