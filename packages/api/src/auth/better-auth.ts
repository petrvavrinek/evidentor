import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

import { db } from "../database";
import * as authSchema from "../db/auth.schema";

export const auth = betterAuth({
  basePath: "/auth",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["*"],
  plugins: [
    openAPI(),
    // organization({
    //   // Enable teams with 1 default
    //   teams: {
    //     enabled: true,
    //     maximumTeams: 1,
    //     allowRemovingAllTeams: false,
    //     defaultTeam: {
    //       enabled: true,
    //     },
    //   },
    // }),
  ],
  user: {
    changeEmail: {
      enabled: false,
    },
  },
  
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
