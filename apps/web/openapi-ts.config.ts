import { defineConfig } from "@hey-api/openapi-ts";
import { datePlugin } from "./openapi/date-plugin";

export default defineConfig({
	input: "http://localhost:3000/swagger/json",
	output: {
		format: "prettier",
		lint: "eslint",
		path: "./src/lib/api",
	},
	plugins: [
		
		{
			name: "@hey-api/client-fetch",
			baseUrl: false,
		},
		{
			name: "@hey-api/schemas",
		},
		"zod",
		{
			name: "@hey-api/transformers",
			dates: true,
		},
		{
			name: "@hey-api/sdk",
			validator: true,
			exportFromIndex: true,
		},
		{
			enums: "javascript",
			name: "@hey-api/typescript",
		},
		{
			name: "@tanstack/react-query",
		},
		datePlugin(),
	],
});
