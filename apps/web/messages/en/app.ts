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
    "settings/user": "User",
    "invoices/listing": "Invoice listing",
    "invoices/rules": "Automatic invoices"
  },
  pages
} satisfies typeof csApp;