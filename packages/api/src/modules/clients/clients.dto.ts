import { createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { client } from "../../db/schema";

export const CreateClient = t.Object({
  companyName: t.String(),
  contactName: t.String(),
});
export const UpdateClient = t.Partial(CreateClient);
export const ClientIdParam = t.Object({
  id: t.Number(),
});

export const ClientResponse = createSelectSchema(client);
export const ClientsResponse = t.Array(ClientResponse);

//export const TimeEntryResponse = createSelectSchema(timeEntry);
