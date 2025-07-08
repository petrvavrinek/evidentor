import { createAuthClient } from "better-auth/react";
import apiConfig from "@/config/api";

export const authClient = createAuthClient({
	baseURL: apiConfig.ApiUrl,
	basePath: "/auth",

	fetchOptions: {
		credentials: "include",
	},
});
