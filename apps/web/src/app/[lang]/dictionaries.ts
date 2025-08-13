import 'server-only';

const dictionaries = {
  en: () => import("./dictionaries/en.json").then(m => m.default),
  cs: () => import("./dictionaries/cs.json").then(m => m.default)
}

export const getDictionary = async (locale: keyof typeof dictionaries) => dictionaries[locale];