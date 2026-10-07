import { createContext } from "react"

import type { Formatters } from "@/helpers"
import type { Locale, MessageKey } from "@/types"

import { en } from "./messages/en"
import { ptBR } from "./messages/ptBR"

export const MESSAGES = { "pt-BR": ptBR, en }

export type TranslationParams = Record<string, string | number>

export type Translate = (key: MessageKey, params?: TranslationParams) => string

export type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translate
  /** Números e datas no formato do idioma atual. */
  fmt: Formatters
}

/** Troca cada `{nome}` do texto pelo parâmetro de mesmo nome. */
export const translate = (locale: Locale, key: MessageKey, params?: TranslationParams): string =>
  MESSAGES[locale][key].replace(/\{(\w+)\}/g, (match, name: string) =>
    params && name in params ? String(params[name]) : match,
  )

export const I18nContext = createContext<I18nContextValue | null>(null)
