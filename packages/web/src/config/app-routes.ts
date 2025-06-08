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
  name: string;
  icon?: LucideIcon;
  id: string;
  description?: string;
} & ({ href: string } | { items: RouteItem[]; defaultOpen?: boolean });

export const appRoutes: RouteItem[] = [
  {
    name: "Dashboard",
    href: "/app",
    icon: Home,
    id: "dashboard",
    description: "Welcome back! Here's an overview of your activity.",
  },
  {
    name: "Clients",
    href: "/app/clients",
    icon: Users,
    id: "clients",
    description: "Manage your clients and their information.",
  },
  {
    name: "Projects",
    href: "/app/projects",
    icon: FolderKanban,
    id: "projects",
    description: "Track and organize your projects.",
  },
  {
    name: "Time Tracker",
    href: "/app/time-tracker",
    icon: Clock,
    id: "time-tracker",
    description: "Log your time and track productivity.",
  },
  {
    name: "Invoices",
    href: "/app/invoices",
    icon: FileText,
    id: "invoices",
    description: "Create and manage invoices for your clients.",
  },
  {
    name: "Reports",
    href: "/app/reports",
    icon: BarChart3,
    id: "reports",
    description: "Analyze your time tracking and project data.",
  },
  {
    name: "Calendar",
    href: "/app/calendar",
    icon: Calendar,
    id: "calendar",
    description: "View your schedule and upcoming events.",
  },
  {
    name: "Settings",
    icon: Settings,
    id: "settings",
    description: "Configure your account and application preferences.",
    items: [
      {
        name: "User",
        href: "/app/settings/user",
        id: "settings/user",
        icon: User,
        description: "Manage your profile and account information.",
        items: [
          {
            name: "Connections",
            href: "/app/settings/user/connections",
            id: "settings/user/connections",
            description: "Connect and manage third-party integrations.",
          },
        ],
      },
      {
        name: "Billing",
        href: "/app/settings/billing",
        id: "settings/billing",
        icon: DollarSign,
        description: "Manage your subscription and billing information.",
      },
      {
        name: "Appearance",
        href: "/app/settings/appearance",
        id: "settings/appearance",
        icon: Palette,
        description: "Customize the look and feel of your workspace.",
      },
    ],
    defaultOpen: false,
  },
];

// Helper function to find a route by path
export function findRouteByPath(path: string): RouteItem | undefined {
  // Normalize path
  const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;

  // Search function
  function search(routes: RouteItem[]): RouteItem | undefined {
    for (const route of routes) {
      // Check if this route matches
      if ("href" in route && route.href === normalizedPath) {
        return route;
      }

      // Check nested routes
      if ("items" in route && route.items) {
        const found = search(route.items);
        if (found) return found;
      }
    }
    return undefined;
  }

  return search(appRoutes);
}

// Helper function to get breadcrumb path
export function getBreadcrumbPath(path: string): RouteItem[] {
  // Normalize path
  const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;
  const result: RouteItem[] = [];

  // Build all possible parent paths
  const segments = normalizedPath.split("/").filter(Boolean);
  const currentPath = "";

  // Start with dashboard if we're in the app
  if (segments[0] === "app") {
    const dashboardRoute = appRoutes.find(
      (route) => "href" in route && route.href === "/app"
    );
    if (dashboardRoute) result.push(dashboardRoute);
  }

  // Function to find a route by segments
  function findRouteBySegments(
    routes: RouteItem[],
    segmentIndex: number,
    parentPath: string
  ): boolean {
    if (segmentIndex >= segments.length) return true;

    for (const route of routes) {
      if ("href" in route) {
        const routeSegments = route.href.split("/").filter(Boolean);
        if (routeSegments[segmentIndex] === segments[segmentIndex]) {
          result.push(route);
          return true;
        }
      }

      if ("items" in route && route.items) {
        if (findRouteBySegments(route.items, segmentIndex, parentPath)) {
          if (!result.includes(route)) {
            result.splice(result.length - 1, 0, route);
          }
          return true;
        }
      }
    }

    return false;
  }

  // Start search from the second segment (after 'app')
  if (segments.length > 1) {
    findRouteBySegments(appRoutes, 1, "/app");
  }

  return result;
}
