import { FX_CHECKS_KEY, FX_PROVIDERS, LOCALE_KEY, ONLINE_FX_SOURCES, STORAGE_KEY } from "@/constants"
import { isFxMeta } from "@/helpers"
import type { FormValues, FxChecks, Locale } from "@/types"

type StoredValues = {
  values: FormValues
  savedAt: number | null
}

/**
 * O que ficou salvo do último uso, ou `null`.
 *
 * Mescla com os padrões: um campo que não existia quando a gravação foi feita
 * chega com o valor padrão em vez de `undefined`. Toda leitura e escrita fica
 * em try/catch porque o navegador pode negar o acesso — janela anônima, dados
 * bloqueados — e isso não pode derrubar a página.
 */
export const loadValues = (defaults: FormValues): StoredValues | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return null
    }

    const data = JSON.parse(raw)

    if (!data?.values) {
      return null
    }

    const values: FormValues = { ...defaults, ...data.values }

    return {
      values: {
        ...values,
        fxMeta: isFxMeta(values.fxMeta) ? values.fxMeta : null,
        fxProvider: FX_PROVIDERS.includes(values.fxProvider) ? values.fxProvider : defaults.fxProvider,
      },
      savedAt: typeof data.savedAt === "number" ? data.savedAt : null,
    }
  } catch {
    return null
  }
}

/** Devolve se conseguiu gravar. */
export const saveValues = (values: FormValues, savedAt: number): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ values, savedAt }))

    return true
  } catch {
    return false
  }
}

export const clearValues = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Sem acesso ao armazenamento não há o que apagar.
  }
}

/** O idioma escolhido na última visita, ou `null` se a pessoa nunca escolheu. */
export const loadLocale = (): Locale | null => {
  try {
    const saved = localStorage.getItem(LOCALE_KEY)

    return saved === "pt-BR" || saved === "en" ? saved : null
  } catch {
    return null
  }
}

export const saveLocale = (locale: Locale) => {
  try {
    localStorage.setItem(LOCALE_KEY, locale)
  } catch {
    // Sem armazenamento, o idioma vale só nesta visita.
  }
}

/** Quando cada fonte de cotação respondeu pela última vez. Só fontes conhecidas, com horário numérico. */
export const loadFxChecks = (): FxChecks => {
  try {
    const data = JSON.parse(localStorage.getItem(FX_CHECKS_KEY) ?? "{}")
    const checks: FxChecks = {}

    for (const source of ONLINE_FX_SOURCES) {
      if (typeof data?.[source] === "number") {
        checks[source] = data[source]
      }
    }

    return checks
  } catch {
    return {}
  }
}

export const saveFxChecks = (checks: FxChecks) => {
  try {
    localStorage.setItem(FX_CHECKS_KEY, JSON.stringify(checks))
  } catch {
    // Sem armazenamento, os horários valem só nesta visita.
  }
}

export const clearFxChecks = () => {
  try {
    localStorage.removeItem(FX_CHECKS_KEY)
  } catch {
    // Sem acesso ao armazenamento não há o que apagar.
  }
}
