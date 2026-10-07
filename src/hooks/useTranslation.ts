import { useContext } from "react"

import { I18nContext } from "@/i18n"

/** `t` para os textos, `fmt` para números e datas, e o idioma atual. */
export const useTranslation = () => {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error("useTranslation precisa estar dentro de <I18nProvider>.")
  }

  return context
}
