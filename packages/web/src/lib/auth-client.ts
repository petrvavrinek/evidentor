import { createAuthClient } from "better-auth/react";
import apiConfig from "@/config/api";

export const authClient = createAuthClient({
  baseURL: apiConfig.ApiUrl,
  basePath: "/api/auth",

  fetchOptions: {
    onRequest(context) {
      console.log("Req", context);
    },
    credentials: "include",
  },
});
