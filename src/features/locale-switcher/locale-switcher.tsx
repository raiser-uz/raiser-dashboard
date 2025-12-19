"use client"

import { usePathname, useRouter } from "i18n/navigation"
import { routing } from "i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "shared/ui"

export const LocaleSwitcher = () => {
  const t = useTranslations("features.locale-switcher")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()

  const switchLocale = (newLocale: string) => {
    router.replace(
      { pathname, query: params },
      {
        locale: newLocale,
      },
    )
  }

  return (
    <Select defaultValue={locale} onValueChange={switchLocale}>
      <SelectTrigger className="min-w-30">
        <SelectValue defaultValue={locale} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t("label")}</SelectLabel>
          {routing.locales.map((loc) => (
            <SelectItem key={loc} value={loc} onSelect={() => switchLocale(loc)}>
              {t(`locales.${loc}`)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
