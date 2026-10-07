import { useEffect, useRef, useState } from "react"

import { DEFAULT_VALUES, SAVE_DELAY_MS } from "@/constants"
import {
  clearFxChecks,
  clearShareParam,
  clearValues,
  loadFxChecks,
  loadValues,
  readSharedValues,
  saveFxChecks,
  saveValues,
} from "@/services"
import type { FormValues, MessageKey, OnlineFxSource } from "@/types"

import { useTranslation } from "./useTranslation"

/**
 * A mensagem guardada como chave, não como texto: traduzida a cada render, ela
 * acompanha a troca de idioma.
 */
type Status = { key: Extract<MessageKey, `status.${string}`>; savedAt?: number } | null

/**
 * De onde a página começa: um link compartilhado vence o que ficou salvo, mas
 * só nos campos que o link traz — a receita bruta de quem abre continua a sua.
 */
const loadInitial = (defaults: FormValues): { values: FormValues; status: Status } => {
  const stored = loadValues(defaults)
  const shared = readSharedValues()

  if (shared) {
    return { values: { ...(stored?.values ?? defaults), ...shared }, status: { key: "status.shared" } }
  }

  if (stored) {
    return {
      values: stored.values,
      status: stored.savedAt
        ? { key: "status.restored", savedAt: stored.savedAt }
        : { key: "status.restoredNoDate" },
    }
  }

  return { values: defaults, status: null }
}

/**
 * O formulário, lembrado neste navegador.
 *
 * Grava um pouco depois da última mudança, não a cada tecla. Só grava o que a
 * pessoa mudou: carregar a página não conta como mudança, senão o "salvo em"
 * do último uso seria trocado pela hora em que a página abriu. Vale também
 * para um link compartilhado — abrir um não apaga o que a pessoa tinha salvo.
 */
export const useStoredValues = () => {
  const { locale, t, fmt } = useTranslation()
  const [initial] = useState(() => loadInitial(DEFAULT_VALUES[locale]))
  const [values, setValues] = useState(initial.values)
  const [status, setStatus] = useState(initial.status)
  const [fxChecks, setFxChecks] = useState(loadFxChecks)
  const isDirty = useRef(false)

  useEffect(clearShareParam, [])

  useEffect(() => {
    if (!isDirty.current) {
      return
    }

    const timer = window.setTimeout(() => {
      const savedAt = Date.now()

      setStatus(saveValues(values, savedAt) ? { key: "status.saved", savedAt } : { key: "status.saveFailed" })
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
    clearFxChecks()
    setFxChecks({})
    setValues(DEFAULT_VALUES[locale])
    setStatus({ key: "status.cleared" })
  }

  /** Anota que a fonte acabou de responder. Grava na hora: não é campo do formulário. */
  const recordFxCheck = (source: OnlineFxSource) => {
    const next = { ...fxChecks, [source]: Date.now() }
    setFxChecks(next)
    saveFxChecks(next)
  }

  return {
    values,
    update,
    reset,
    fxChecks,
    recordFxCheck,
    status: status ? t(status.key, { date: status.savedAt ? fmt.dateTime(status.savedAt) : "" }) : "",
  }
}
