import cs from './cs';
import en from "./en";

const translations = { cs, en };
export type Language = keyof typeof translations;
export const getTranslations = (lang: Language) => translations[lang];
export type Translations = typeof cs;