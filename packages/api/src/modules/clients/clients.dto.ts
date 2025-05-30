import { t } from "elysia";

export const CreateClient = t.Object({
  name: t.String(),
});
export const UpdateClient = t.Partial(CreateClient);
export const ClientIdParam = t.Object({
  id: t.Number(),
});

//export const TimeEntryResponse = createSelectSchema(timeEntry);
