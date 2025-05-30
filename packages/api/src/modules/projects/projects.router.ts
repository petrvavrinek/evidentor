import { and, eq } from "drizzle-orm";
import Elysia, { status } from "elysia";
import { betterAuth } from "../../auth/index";
import { db } from "../../database";
import { project } from "../../db/schema";
import { CreateProject, ProjectIdParam, UpdateProject } from "./projects.dto";

export const router = new Elysia({
  prefix: "/v1/project",
  detail: { tags: ["Project"] },
})
  .use(betterAuth)
  .get(
    "",
    async ({ user }) => {
      const projects = await db.query.project.findMany({
        where: eq(project.ownerId, user.id),
      });
      return projects;
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

      // TODO: Client ID

      const newProject = await db
        .insert(project)
        .values({
          title,
          clientId,
          ownerId: user.id,
        })
        .returning();

      if (!newProject.length) return status(500, "Internal Server Error");
      return newProject[0];
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

      const foundProject = await db.query.project.findFirst({
        where: and(eq(project.id, id), eq(project.ownerId, user.id)),
      });

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
      const updatedProject = await db
        .update(project)
        .set(body)
        .where(and(eq(project.id, id), eq(project.ownerId, user.id)))
        .returning();

      if (!updatedProject.length) return status(404, "Project not found");
      return updatedProject[0];
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

      await db
        .delete(project)
        .where(and(eq(project.id, id), eq(project.ownerId, user.id)));
    },
    {
      auth: true,
      params: ProjectIdParam,
      detail: {
        description: "Delete user project, all time entries will be removed",
      },
    }
  );
