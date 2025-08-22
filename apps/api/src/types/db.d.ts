import type { BunSQLQueryResultHKT } from "drizzle-orm/bun-sql"
import type { PgTransaction } from "drizzle-orm/pg-core"

import type schema from "@/db/schema";
import type { ExtractTablesWithRelations } from "drizzle-orm";

export type WithTransaction<T extends object = {}> = T & {
  tx: PgTransaction<BunSQLQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>
}