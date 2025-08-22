import { eq } from "drizzle-orm"
import { db } from "../../database"
import type { UpdateUserBilling, UserBillingResponse } from "./user-billing.schema"
import { userBilling } from "@/db/user-billing.schema"
import type { WithTransaction } from "../../types/db"
import { addresses } from "@/db/address.schema"

const UserBillingService = {

  async findByUserId(userId: string, options?: WithTransaction): Promise<UserBillingResponse | null> {
    const connection = options?.tx ?? db;

    const result = await connection.query.userBilling.findFirst({
      where: eq(userBilling.userId, userId),
      with: {
        address: true
      }
    });
    if (!result) return null;

    return {
      address: result.address,
      addressId: result.addressId,
      bankAccount: result.bankAccount,
      companyName: result.companyName,
      userId: result.userId,
      companyId: result.companyId,
      vatNumber: result.vatNumber,
      vatPayer: result.vatPayer
    }
  },

  /**
   * Update billing data by user
   * @param userId User ID
   * @param data Billing data
   */
  async updateByUserId(userId: string, data: UpdateUserBilling) {
    return db.transaction(async tx => {
      const existingBilling = await this.findByUserId(userId, { tx });
      if (existingBilling) {
        await tx
          .update(addresses)
          .set(data.address)
          .where(eq(addresses.id, existingBilling.addressId));

        await tx
          .update(userBilling)
          .set({
            bankAccount: data.bankAccount,
            companyName: data.companyName,
            companyId: data.companyId,
            vatNumber: data.vatNumber,
            vatPayer: data.vatPayer,
          })
          .where(eq(userBilling.userId, existingBilling.userId));


        return this.findByUserId(userId, { tx });
      }

      const [address] = await tx.insert(addresses).values(data.address).returning();


      await tx.insert(userBilling).values({
        addressId: address!.id!,
        bankAccount: data.bankAccount,
        companyName: data.companyName,
        companyId: data.companyId,
        vatNumber: data.vatNumber,
        vatPayer: data.vatPayer,
        userId
      });

      return this.findByUserId(userId, { tx });
    });
  }
}
export default UserBillingService;