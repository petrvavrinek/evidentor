import { useLocale } from "next-intl"

export const useDateFormatter = (options?: Intl.DateTimeFormatOptions) => {
  const locale = useLocale();
  return new Intl.DateTimeFormat(locale, options);
}