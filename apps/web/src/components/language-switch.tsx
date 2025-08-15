"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Languages, Language } from "@/i18n/routing";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@evidentor/ui/components/ui/select";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";

type LocaleTextType = {
  [K in Languages[number]]: string;
}

const localeTexts: LocaleTextType = {
  cs: "Česky",
  en: "English"
} as const;

interface LanguageSwitchProps {
  className?: string
}


export default function LanguageSwitch({ className }: LanguageSwitchProps) {
  const [isPending, startTransition] = useTransition();

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  

  const onValueChange = (e: string) => {
    if (!(e in localeTexts)) return;
    startTransition(() => {
      router.replace({ pathname }, { locale: e })
    });
  }

  return (
    <Select defaultValue={locale} onValueChange={onValueChange} disabled={isPending}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={localeTexts[locale as Language]} />
      </SelectTrigger>
      <SelectContent>
        {
          Object.keys(localeTexts).map(locale =>
            <SelectItem value={locale}>{localeTexts[locale as Language]}</SelectItem>
          )
        }
      </SelectContent>
    </Select>
  );
}