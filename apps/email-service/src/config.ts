import { z } from "zod/v4";

const envSchema = z.object({
	SMTP_HOST: z.string(),
	MAIL_USER: z.string(),
	MAIL_PASS: z.string(),
	FRONTEND_URL: z.url()
});

export const envConfig = envSchema.parse(process.env);
