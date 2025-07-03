import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
	input: "http://localhost:3000/swagger/json",
	output: {
		format: "prettier",
		lint: "eslint",
		path: "./src/lib/api",
	},
	plugins: [
		"@hey-api/client-fetch",
		"@hey-api/schemas",
		"zod",
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
	],
});
