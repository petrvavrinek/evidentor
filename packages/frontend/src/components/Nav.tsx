import { useLocation } from "@solidjs/router";

import {
  Home,
  Users,
  FolderKanban,
  Clock,
  FileText,
  BarChart3,
  Calendar,
  Settings,
  Briefcase
} from "lucide-solid";
import { Button } from "./ui/button";

export default function Nav() {
  const location = useLocation();

  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home, id: "dashboard" },
    { name: "Clients", href: "/clients", icon: Users, id: "clients" },
    { name: "Projects", href: "/projects", icon: FolderKanban, id: "projects" },
    {
      name: "Time Tracker",
      href: "/time-tracker",
      icon: Clock,
      id: "time-tracker",
    },
    { name: "Invoices", href: "/invoices", icon: FileText, id: "invoices" },
    { name: "Reports", href: "/reports", icon: BarChart3, id: "reports" },
    { name: "Calendar", href: "#", icon: Calendar, id: "calendar" },
    { name: "Settings", href: "/settings", icon: Settings, id: "settings" },
  ];

  const NavItems = ({ mobile = false }) => (
    <nav class={`space-y-2 ${mobile ? "p-4" : ""} flex-1`}>
      {navigation.map((item) => (
        <Button
          variant={false ? "secondary" : "ghost"}
          class="w-full justify-start"
        >
          <a href={item.href} class="flex items-center gap-2">
            <item.icon class="h-4 w-4" />
            {item.name}
          </a>
        </Button>
      ))}
    </nav>
  );

  return (
    <aside class="hidden w-64 flex-col bg-background border-r p-4 md:flex">
      <div class="flex items-center gap-2 mb-8">
        <Briefcase class="h-6 w-6" />
        <h1 class="text-xl font-bold">WorkTracker</h1>
      </div>

      <NavItems />
    </aside>
  );
}
{
  /* <nav class="bg-sky-800">
<ul class="container flex items-center p-3 text-gray-200">
  <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
    <a href="/">Home</a>
  </li>
  <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
    <a href="/about">About</a>
  </li>
</ul>
</nav> */
}
