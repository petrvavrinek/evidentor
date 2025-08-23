import { pgEnum } from "drizzle-orm/pg-core";
import { Currencies } from "../constants";

export const CurrencyEnum = pgEnum("currency", Currencies);