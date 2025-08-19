export const Currencies = ["czk", "eur", "usd"] as const;
export type Currency = (typeof Currencies)[number];

export const Languages = ["cs", "en"] as const;
export type Language = (typeof Languages)[number];