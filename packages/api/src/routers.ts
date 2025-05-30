import { router as timeEntryRouter } from "./modules/time-entries/time-entries.router";
import { router as clientRouter } from "./modules/clients/clients.router";

export const routers = [timeEntryRouter, clientRouter] as const;
