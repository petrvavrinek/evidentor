import { z } from "zod";

const env = z.object({
  NEXT_PUBLIC_APP_URL: z.string(),
  NEXT_PUBLIC_API_URL: z.string(),
});

const parsedEnv = env.parse(process.env);

export default parsedEnv;
