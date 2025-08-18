"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Language } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import LocaleInput from "./locale-input";

interface LanguageSwitchProps {
  className?: string
}

export default function LanguageSwitch({ className }: LanguageSwitchProps) {
  const [isPending, startTransition] = useTransition();

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();


  const onValueChange = (e: Language) => {
    startTransition(() => {
      router.replace({ pathname }, { locale: e })
    });
  }

  return <LocaleInput value={locale as never} disabled={isPending} onChange={onValueChange} className={className} />
}