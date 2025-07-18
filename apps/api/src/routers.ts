import { router as analyticsRouter } from "./modules/analytics/analytics.router";
import { router as clientRouter } from "./modules/clients/clients.router";
import { router as projectTasksRouter } from "./modules/project-tasks/project-tasks.router";
import { router as projectRouter } from "./modules/projects/projects.router";
import { router as timeEntryRouter } from "./modules/time-entries/time-entries.router";
import { invoicesRouter } from "./modules/invoices/invoices.router";
import { calendarRouter } from "./modules/calendar/calendar.router";

export {
	analyticsRouter,
	clientRouter,
	projectRouter,
	projectTasksRouter,
	timeEntryRouter,
	invoicesRouter,
	calendarRouter,
};
