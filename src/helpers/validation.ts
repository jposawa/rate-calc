import { FX_SOURCES } from "@/constants"
import type { BreakdownInput, FieldErrors, FormValues, FxMeta } from "@/types"

import { parseNumber } from "./number"

type Validation = {
  errors: FieldErrors
  /** `null` enquanto faltar campo obrigatório ou houver erro. */
  input: BreakdownInput | null
}

const REQUIRED = [
  { field: "rate", error: "validation.ratePositive" },
  { field: "hours", error: "validation.hoursPositive" },
  { field: "fx", error: "validation.fxPositive" },
] as const

/** Vazio conta como 0%: são os dois campos opcionais. */
const PERCENT = ["spread", "tax"] as const

/**
 * Converte o formulário em números e diz o que está errado.
 *
 * Campo obrigatório vazio não é erro — é só formulário incompleto. Ninguém
 * precisa de mensagem vermelha num campo que ainda nem tocou.
 */
export const validateValues = (values: FormValues): Validation => {
  const errors: FieldErrors = {}
  const numbers = {} as BreakdownInput
  let isComplete = true

  for (const { field, error } of REQUIRED) {
    const value = parseNumber(values[field])
    numbers[field] = value

    if (values[field].trim() === "") {
      isComplete = false
    } else if (!(value > 0)) {
      errors[field] = error
    }
  }

  for (const field of PERCENT) {
    const value = values[field].trim() === "" ? 0 : parseNumber(values[field])
    numbers[field] = value

    if (!(value >= 0 && value < 100)) {
      errors[field] = "validation.percentRange"
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  return { errors, input: isComplete && !hasErrors ? numbers : null }
}

/**
 * Se o que veio de fora — do armazenamento ou de um link — é uma origem de
 * cotação que esta versão entende. Gravações antigas tinham o nome da fonte
 * em texto; essas não passam, e o campo fica como "informado manualmente".
 */
export const isFxMeta = (value: unknown): value is FxMeta => {
  const meta = value as Partial<FxMeta> | null

  return (
    typeof meta?.date === "string" &&
    typeof meta.source === "string" &&
    FX_SOURCES.includes(meta.source)
  )
}
