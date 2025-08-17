import { z } from "zod/v4-mini";

const EnvSchema = z.object({
	REDIS_URI: z.optional(z.string())
});

export const envConfig = EnvSchema.parse(process.env);
