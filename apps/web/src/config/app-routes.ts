import {
  BarChart3,
  Calendar,
  ClipboardPlus,
  Clock,
  DollarSign,
  FileText,
  FolderKanban,
  Home,
  List,
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
    icon: FileText,
    id: "invoices",
    items: [
      {
        href: "/app/invoices",
        id: "invoices/listing",
        icon: List
      },
      {
        href: "/app/invoices/rules",
        id: "invoices/rules",
        icon: ClipboardPlus
      }
    ]
  },
  // {
  //   href: "/app/reports",
  //   icon: BarChart3,
  //   id: "statistics",
  // },
  // {
  //   href: "/app/calendar",
  //   icon: Calendar,
  //   id: "calendar",
  // },
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