import { useEffect, useRef, useState } from "react"

import { DEFAULT_VALUES, SAVE_DELAY_MS } from "@/constants"
import { formatDateTime } from "@/helpers"
import { clearValues, loadValues, saveValues } from "@/services"
import type { FormValues } from "@/types"

const describeRestored = (savedAt: number | null) =>
  savedAt
    ? `Valores do último uso, salvos em ${formatDateTime(savedAt)}.`
    : "Valores do último uso restaurados."

/**
 * O formulário, lembrado neste navegador.
 *
 * Grava um pouco depois da última mudança, não a cada tecla. Só grava o que a
 * pessoa mudou: carregar a página não conta como mudança, senão o "salvo em"
 * do último uso seria trocado pela hora em que a página abriu.
 */
export const useStoredValues = () => {
  const [stored] = useState(loadValues)
  const [values, setValues] = useState<FormValues>(stored?.values ?? DEFAULT_VALUES)
  const [status, setStatus] = useState(stored ? describeRestored(stored.savedAt) : "")
  const isDirty = useRef(false)

  useEffect(() => {
    if (!isDirty.current) {
      return
    }

    const timer = window.setTimeout(() => {
      const savedAt = Date.now()

      setStatus(
        saveValues(values, savedAt)
          ? `Salvo neste navegador em ${formatDateTime(savedAt)}.`
          : "Não foi possível salvar neste navegador. Os valores valem só nesta sessão.",
      )
    }, SAVE_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [values])

  const update = (patch: Partial<FormValues>) => {
    isDirty.current = true
    setValues((previous) => ({ ...previous, ...patch }))
  }

  /** Apaga o que foi salvo e volta aos padrões, sem gravar os padrões em seguida. */
  const reset = () => {
    isDirty.current = false
    clearValues()
    setValues(DEFAULT_VALUES)
    setStatus("Dados salvos apagados. Valores padrão restaurados.")
  }

  return { values, update, reset, status }
}
