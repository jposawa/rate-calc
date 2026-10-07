import { useEffect, useMemo, useState } from "react"

import { createFormatters } from "@/helpers"
import { loadLocale, saveLocale } from "@/services"
import type { Locale } from "@/types"

import { I18nContext, translate, type I18nContextValue } from "./context"

/**
 * O idioma escolhido antes, se houver; senão, português para quem tem
 * português em qualquer posição das preferências do navegador — muita gente
 * daqui usa o navegador em inglês — e inglês para o resto.
 */
const detectLocale = (): Locale => {
  const saved = loadLocale()

  if (saved) {
    return saved
  }

  const languages = navigator.languages?.length ? navigator.languages : [navigator.language]

  return languages.some((language) => language?.toLowerCase().startsWith("pt")) ? "pt-BR" : "en"
}

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState(detectLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: (next) => {
        setLocaleState(next)
        saveLocale(next)
      },
      t: (key, params) => translate(locale, key, params),
      fmt: createFormatters(locale),
    }),
    [locale],
  )

  return <I18nContext value={value}>{children}</I18nContext>
}
