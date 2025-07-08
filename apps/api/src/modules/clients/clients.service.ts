import { and, eq } from "drizzle-orm";
import { db } from "../../database";
import { client } from "../../db/schema";

type Client = typeof client.$inferSelect;

export const ClientsService = {
  findById(userId: string, id: number) {
    return db.query.client.findFirst({
      where: and(eq(client.ownerId, userId), eq(client.id, id)),
    });
  },

  findManyByUserId(userId: string) {
    return db.query.client.findMany({
      where: eq(client.ownerId, userId),
    });
  },

  async create(userId: string, data: Partial<Omit<Client, "id">>) {
    const [newClient] = await db
      .insert(client)
      .values({
        ...data,
        ownerId: userId,
      })
      .returning();
    return newClient;
  },

  async updateById(
    userId: string,
    id: number,
    data: Partial<Omit<Client, "id" | "ownerId" | "createdAt">>
  ) {
    const updatedClient = await db
      .update(client)
      .set(data)
      .where(and(eq(client.ownerId, userId), eq(client.id, id)))
      .returning();

    return updatedClient[0] ?? null;
  },

  async deleteById(userId: string, id: number) {
    const deletedClient = await db
      .delete(client)
      .where(and(eq(client.ownerId, userId), eq(client.id, id)))
      .returning();
    return deletedClient[0] ?? null;
  },
};
