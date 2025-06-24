import { defineConfig } from "@hey-api/openapi-ts";

// A robust recursive walker
function walk(node: any, callback: (n: any) => void) {
  callback(node);
  if (node && typeof node === "object") {
    for (const key in node) {
      walk(node[key], callback);
    }
  }
}

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
