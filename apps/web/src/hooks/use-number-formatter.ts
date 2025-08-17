import { useLocale } from "next-intl"

export const useNumberFormatter = (options?: Intl.NumberFormatOptions) => {
  const locale = useLocale();
  return new Intl.NumberFormat(locale, options);
}