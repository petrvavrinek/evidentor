import { router as timeEntryRouter } from "./modules/time-entries/time-entries.router";
import { router as clientRouter } from "./modules/clients/clients.router";
import { router as projectRouter } from "./modules/projects/projects.router";

export const routers = [timeEntryRouter, clientRouter, projectRouter] as const;
