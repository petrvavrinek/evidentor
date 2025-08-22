import { pgEnum } from "drizzle-orm/pg-core";
import { Languages } from "../constants";

export const LanguageEnum = pgEnum("language", Languages);