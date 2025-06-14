import { createAuthClient } from "better-auth/react";
import env from "@/lib/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
  basePath: "/api/auth",

  fetchOptions: {
    onRequest(context) {
      console.log("Req", context);
    },
    credentials: "include",
  },
});
