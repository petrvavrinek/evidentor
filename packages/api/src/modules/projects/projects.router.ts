import Elysia, { status } from "elysia";
import { betterAuth } from "../../auth/index";
import { CreateProject, ProjectIdParam, UpdateProject } from "./projects.dto";

import { ClientsService } from "../clients/clients.service";
import { ProjectsService } from "./projects.service";

export const router = new Elysia({
  prefix: "/v1/project",
  detail: { tags: ["Project"] },
})
  .use(betterAuth)
  .get(
    "",
    async ({ user }) => {
      return ProjectsService.findManyByUserId(user.id);
    },
    {
      auth: true,
      detail: {
        description: "Get all user projects",
      },
    }
  )
  .post(
    "",
    async (c) => {
      const { title, clientId } = c.body;
      const { user } = c;

      // Check if client is user-defined client
      const client = await ClientsService.findById(user.id, clientId);
      if (!client) return status(400, "Client not found");

      return ProjectsService.create(user.id, { title, clientId });
    },
    {
      auth: true,
      body: CreateProject,
      detail: {
        description: "Create new user project",
      },
    }
  )
  .get(
    ":id",
    async ({ params, user }) => {
      const { id } = params;

      const foundProject = await ProjectsService.findById(user.id, id);

      if (!foundProject) return status(404, "Project not found");
      return foundProject;
    },
    {
      auth: true,
      params: ProjectIdParam,
      detail: {
        description: "Get user project by ID",
      },
    }
  )
  .patch(
    ":id",
    async ({ params, body, user }) => {
      const { id } = params;

      const updatedProject = await ProjectsService.updateById(
        user.id,
        id,
        body
      );

      if (!updatedProject) return status(404, "Project not found");
      return updatedProject;
    },
    {
      auth: true,
      body: UpdateProject,
      params: ProjectIdParam,
      detail: {
        description: "Update user project data",
      },
    }
  )
  .delete(
    ":id",
    async ({ params, user }) => {
      const { id } = params;

      await ProjectsService.deleteById(user.id, id);
    },
    {
      auth: true,
      params: ProjectIdParam,
      detail: {
        description: "Delete user project, all time entries will be removed",
      },
    }
  );
