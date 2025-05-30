import { t } from "elysia";

export const CreateProject = t.Object({
  title: t.String(),
  clientId: t.Number(),
});
export const UpdateProject = t.Partial(CreateProject);
export const ProjectIdParam = t.Object({
  id: t.Number(),
});
