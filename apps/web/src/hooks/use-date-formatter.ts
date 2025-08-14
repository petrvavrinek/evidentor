import { useLocale } from "next-intl"

export const useDateFormatter = () => {
  const locale = useLocale();
  return new Intl.DateTimeFormat(locale);
}