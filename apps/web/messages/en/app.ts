import type csApp from "../cs/app";
import pages from "./pages";

export default {
  sidebar: {
    calendar: "Calendar",
    clients: "Clients",
    dashboard: "Dashboard",
    invoices: "Invoices",
    projects: "Projects",
    settings: "Settings",
    statistics: "Statistics",
    timeTracker: "Time tracking",
    "settings/appearance": "Appearance and language",
    "settings/billing": "Billing",
    "settings/user": "User"
  },
  pages
} satisfies typeof csApp;