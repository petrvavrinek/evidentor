import { z } from "zod/v4";

const envSchema = z.object({
	SMTP_HOST: z.string(),
	MAIL_USER: z.string(),
	MAIL_PASS: z.string(),
});

export const envConfig = envSchema.parse(process.env);
