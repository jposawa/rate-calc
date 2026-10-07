import type { BreakdownInput, FieldErrors, FormValues } from "@/types"

import { parseNumber } from "./number"

type Validation = {
  errors: FieldErrors
  /** `null` enquanto faltar campo obrigatório ou houver erro. */
  input: BreakdownInput | null
}

const REQUIRED = [
  { field: "rate", label: "O valor/hora" },
  { field: "hours", label: "As horas" },
  { field: "fx", label: "A cotação" },
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

  for (const { field, label } of REQUIRED) {
    const value = parseNumber(values[field])
    numbers[field] = value

    if (values[field].trim() === "") {
      isComplete = false
    } else if (!(value > 0)) {
      errors[field] = `${label} precisa ser um número maior que zero.`
    }
  }

  for (const field of PERCENT) {
    const value = values[field].trim() === "" ? 0 : parseNumber(values[field])
    numbers[field] = value

    if (!(value >= 0 && value < 100)) {
      errors[field] = "Use um percentual entre 0 e 100."
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  return { errors, input: isComplete && !hasErrors ? numbers : null }
}
