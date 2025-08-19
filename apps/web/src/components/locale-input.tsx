"use client";

import { Language, Languages } from "@/i18n/routing";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@evidentor/ui/components/ui/select";
import { useLocale } from "next-intl";

type LocaleTextType = {
  [K in Languages[number]]: string;
}

const localeTexts: LocaleTextType = {
  cs: "Česky",
  en: "English"
} as const;

interface LanguageSwitchProps {
  className?: string,
  value?: Language;
  onChange?: (newLocale: Language) => void;
  disabled?: boolean;
}

export default function LocaleInput({ className, onChange, value }: LanguageSwitchProps) {
  const locale = useLocale();
  const onValueChange = (e: string) => {
    if (!(e in localeTexts)) return;
    onChange?.(e as Language);
  }

  return (
    <Select defaultValue={value} value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={localeTexts[locale as Language]} />
      </SelectTrigger>
      <SelectContent>
        {
          Object.keys(localeTexts).map(locale =>
            <SelectItem key={locale} value={locale}>{localeTexts[locale as Language]}</SelectItem>
          )
        }
      </SelectContent>
    </Select>
  );
}