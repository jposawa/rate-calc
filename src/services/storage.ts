import { DEFAULT_VALUES, STORAGE_KEY } from "@/constants"
import type { FormValues } from "@/types"

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
export const loadValues = (): StoredValues | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return null
    }

    const data = JSON.parse(raw)

    if (!data?.values) {
      return null
    }

    return {
      values: { ...DEFAULT_VALUES, ...data.values },
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
