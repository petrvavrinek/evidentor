import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  basePath: "/api/auth",

  fetchOptions: {
    onRequest(context) {
      console.log("Req", context);
    },
    credentials: "include",
  },
});
