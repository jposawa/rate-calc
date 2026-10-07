import type { Locale } from "@/types"

import { parseNumber } from "./number"

/** Teto de dígitos: bem acima de qualquer valor real, e longe da imprecisão do `number`. */
const MAX_DIGITS = 15

const separatorOf = (locale: Locale) => (locale === "en" ? "." : ",")

/**
 * Máscara de caixa eletrônico: só dígitos, preenchidos a partir das casas
 * decimais. Com duas casas, "3" vira "0,03", "30" vira "0,30", "3000" vira
 * "30,00". Ponto e vírgula digitados são ignorados — o separador é sempre o
 * da máscara, com o do idioma.
 */
export const maskDecimal = (raw: string, decimals: number, locale: Locale): string => {
  const digits = raw.replace(/\D/g, "").replace(/^0+/, "").slice(0, MAX_DIGITS)

  if (!digits) {
    return ""
  }

  const padded = digits.padStart(decimals + 1, "0")

  return decimals === 0
    ? padded
    : `${padded.slice(0, -decimals)}${separatorOf(locale)}${padded.slice(-decimals)}`
}

/**
 * Um valor qualquer — salvo de uma versão sem máscara, vindo de um link,
 * colado — já no formato da máscara: "30" vira "30,00", e não "0,30".
 */
export const toDecimalText = (raw: string, decimals: number, locale: Locale): string => {
  const value = parseNumber(raw)

  return Number.isFinite(value) && value >= 0
    ? value.toFixed(decimals).replace(".", separatorOf(locale))
    : ""
}
