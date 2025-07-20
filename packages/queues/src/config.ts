import { z } from "zod/v4-mini";

const EnvSchema = z.object({
	REDIS_HOST: z.optional(z.string()),
	REDIS_PORT: z.optional(z.number()),
	REDIS_USER: z.optional(z.string()),
	REDIS_PASSWORD: z.optional(z.string()),
});

export const envConfig = EnvSchema.parse(process.env);
