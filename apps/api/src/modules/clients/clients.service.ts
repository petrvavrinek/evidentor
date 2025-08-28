import { and, eq } from "drizzle-orm";

import { db } from "../../database";
import type { CreateClient, UpdateClient } from "./clients.types";

import { addresses } from "@/db/address.schema";
import { clients } from "@/db/clients.schema";

export const ClientsService = {
  findById(userId: string, id: number) {
    return db.query.clients.findFirst({
      where: and(eq(clients.ownerId, userId), eq(clients.id, id)),
      with: {
        address: true,
      }
    });
  },

  findManyByUserId(userId: string) {
    return db.query.clients.findMany({
      where: eq(clients.ownerId, userId),
      with: {
        address: true,
      }
    });
  },

  async create(userId: string, data: CreateClient) {
    return db.transaction(async tx => {
      let addressId: number | undefined = undefined;

      if (data.address) {
        const { address: a } = data;
        const [newAddress] = await tx.insert(addresses).values({
          streetLine1: a.streetLine1,
          streetLine2: a.streetLine2,
          city: a.city,
          country: a.country,
          postalCode: a.postalCode,
          state: a.state,
        }).returning()
        if (newAddress) addressId = newAddress.id;
      }

      const [newClient] = await tx.insert(clients).values({
        companyName: data.companyName,
        contactName: data.contactName,
        email: data.email,
        ownerId: userId,
        addressId
      })
        .returning();

      if (!newClient) return null;

      return tx.query.clients.findFirst({
        where: eq(clients.id, newClient!.id),
        with: {
          address: true,
        }
      });
    });
  },

  async updateById(
    userId: string,
    id: number,
    data: UpdateClient
  ) {
    const client = await this.findById(userId, id);
    // Client not found
    if (!client) return null;

    return db.transaction(async tx => {
      let addressId = client.address?.id;

      // Address update
      if (!client.address && data.address) {
        const { address } = data;
        const [newAddress] = await tx.insert(addresses).values({
          city: address.city,
          country: address.country,
          streetLine1: address.streetLine1,
          streetLine2: address.streetLine2,
          postalCode: address.postalCode,
          state: address.state,
        }).returning();

        if (!newAddress) return null;
        addressId = newAddress.id;
      } else if (client.address && data.address) {
        const { address } = data;
        await tx.update(addresses).set({
          city: address.city,
          country: address.country,
          streetLine1: address.streetLine1,
          streetLine2: address.streetLine2,
          postalCode: address.postalCode,
          state: address.state,
        }).where(eq(addresses.id, client.address.id));
      }

      const [updatedClient] = await tx.update(clients).set({
        addressId,
        companyName: data.companyName,
        contactName: data.contactName,
        email: data.email
      })
      .where(eq(clients.id, id))
      .returning();

      return updatedClient ?? null;
    });
  },

  async deleteById(userId: string, id: number) {
    const deletedClient = await db
      .delete(clients)
      .where(and(eq(clients.ownerId, userId), eq(clients.id, id)))
      .returning();
    return deletedClient[0] ?? null;
  },
};
