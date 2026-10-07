import type { Locale } from "@/types"

export type Formatters = ReturnType<typeof createFormatters>

/** "2026-10-07" ou "2026-10-07 13:05" — o formato em que as datas da cotação são guardadas. */
const QUOTE_DATE = /^(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2}))?$/

/**
 * Números e datas no formato de um idioma.
 *
 * Os valores continuam em reais e dólares nos dois idiomas; muda só a escrita
 * — "R$ 1.234,56" em português, "R$1,234.56" em inglês.
 */
export const createFormatters = (locale: Locale) => {
  const brl = new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" })
  const usd = new Intl.NumberFormat(locale, { style: "currency", currency: "USD" })
  const percent = new Intl.NumberFormat(locale, { minimumFractionDigits: 0, maximumFractionDigits: 3 })
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "short" })
  const dateTime = new Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short" })
  const decimalSeparator = locale === "en" ? "." : ","

  return {
    brl: (value: number): string => brl.format(value),

    usd: (value: number): string => usd.format(value),

    /** Só o número, sem o "%": "6", "0,5", "3,123". Quem chama põe o sinal. */
    percent: (value: number, fractionDigits?: number): string =>
      percent.format(fractionDigits === undefined ? value : Number(value.toFixed(fractionDigits))),

    dateTime: (timestamp: number): string => dateTime.format(timestamp),

    /** A data guardada da cotação; o que não estiver no formato esperado passa como veio. */
    quoteDate: (raw: string): string => {
      const match = QUOTE_DATE.exec(raw)

      if (!match) {
        return raw
      }

      const [, year, month, day, hour, minute] = match.map(Number)
      // Construída no fuso local: `new Date("2026-10-07")` seria meia-noite
      // UTC, que no Brasil ainda é o dia 6.
      const value = new Date(year, month - 1, day, hour || 0, minute || 0)

      return match[4] ? dateTime.format(value) : date.format(value)
    },

    /** A cotação como vai no campo: quatro casas, com o separador decimal do idioma. */
    rateInput: (rate: number): string => rate.toFixed(4).replace(".", decimalSeparator),
  }
}
