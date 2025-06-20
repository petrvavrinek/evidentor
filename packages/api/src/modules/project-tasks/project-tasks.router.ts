import Elysia from "elysia";
import { betterAuth } from "../../auth";
import { ProjectTaskResponse, ProjectTasksResponse } from "./project-tasks.dto";
import { ProjectTasksService } from "./project-tasks.service";

export const router = new Elysia({
  prefix: "/project-task",
  detail: { tags: ["ProjectTask"] },
})
  .use(betterAuth)
  .model("ProjectTask", ProjectTaskResponse)
  .model("ProjectTask[]", ProjectTasksResponse)
  .get(
    "",
    async ({ user }) => {
      return ProjectTasksService.findAllByUserId(user.id);
    },
    { auth: true, response: "ProjectTask[]" }
  );
