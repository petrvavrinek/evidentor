import {defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["cs", "en"],
  defaultLocale: "cs"
});

export type Languages = typeof routing.locales;
export type Language = Languages[number];