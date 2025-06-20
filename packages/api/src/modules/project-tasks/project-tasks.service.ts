import { client, project, projectTask } from "@/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import { db } from "../../database";

export const ProjectTasksService = {
  /**
   * Find all user tasks
   * @param userId
   * @returns
   */
  async findAllByUserId(userId: string) {
    const tasks = await db
      .select({
        ...getTableColumns(projectTask),
        project: {
          ...getTableColumns(project),
          // @ts-ignore
          client: {
            ...getTableColumns(client),
          },
        },
        
      })
      .from(projectTask)
      .leftJoin(project, eq(projectTask.projectId, project.id))
      .innerJoin(client, eq(client.id, project.clientId));

    return tasks;
  },

  /**
   * Find all user project tasks
   * @param userId User ID
   * @returns Array of tasks
   */

  findByUserAndProjectId(userId: string, projectId: number) {
    return db.query.projectTask.findMany({
      with: {
        project: {
          with: {
            client: true,
          },
        },
      },
      // where: and(eq(project.ownerId, userId), eq(project.id, projectId)),
    });
  },
};
