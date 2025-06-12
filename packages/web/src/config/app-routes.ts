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
  hidden?: boolean; // Added hidden property
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
          {
            name: "Active sessions",
            href: "/app/settings/user/sessions",
            id: "settings/user/sessions",
            description: "Manage active sessions",
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
      // Check nested routes
      if ("items" in route && route.items) {
        const found = search(route.items);
        if (found) return found;
      }

      // Check if this route matches
      if ("href" in route && route.href === normalizedPath) {
        return route;
      }
    }
    return undefined;
  }

  return search(appRoutes);
}

export function getBreadcrumbPath(pathname: string): RouteItem[] {
  const segments = pathname.split("/").filter(Boolean); // e.g., ["app", "settings", "user", "connections"]

  const pathSoFar: string[] = [];
  const result: RouteItem[] = [];

  function traverse(routes: RouteItem[], depth = 0): boolean {
    for (const route of routes) {
      // Skip hidden routes
      if (route.hidden) continue;

      const isGroup = "items" in route;
      const isMatch = "href" in route && pathname === route.href; // Exact match (for leaf nodes)

      // Check path progression for partial matches
      if ("href" in route) {
        const routeSegments = route.href.split("/").filter(Boolean);

        // Ensure the route href is a prefix of the current pathname
        const isPrefix = routeSegments.every(
          (seg, idx) => segments[idx] === seg
        );

        if (isPrefix) {
          pathSoFar.push(route.href);
          result.push(route);

          if (isMatch) return true; // Fully matched
        }
      } else {
        result.push(route);
      }

      if (isGroup && traverse(route.items, depth + 1)) {
        return true;
      }

      // If not matched in this path, backtrack
      if (
        !isMatch &&
        result.length > 0 &&
        result[result.length - 1] === route
      ) {
        result.pop();
      }
    }
    return false;
  }

  traverse(appRoutes);
  return result;
}

// Helper function to get visible routes (non-hidden)
export function getVisibleRoutes(routes: RouteItem[]): RouteItem[] {
  return routes
    .filter((route) => !route.hidden)
    .map((route) => {
      if ("items" in route) {
        return {
          ...route,
          items: getVisibleRoutes(route.items),
        };
      }
      return route;
    });
}
