const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
const usd = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD" })
const percent = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 3 })
const dateTime = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" })

export const formatBRL = (value: number): string => brl.format(value)

export const formatUSD = (value: number): string => usd.format(value)

/** Só o número, sem o "%": "6", "0,5", "3,123". Quem chama põe o sinal. */
export const formatPercent = (value: number, fractionDigits?: number): string =>
  percent.format(fractionDigits === undefined ? value : Number(value.toFixed(fractionDigits)))

export const formatDateTime = (timestamp: number): string => dateTime.format(timestamp)

/** A cotação como vai no campo: quatro casas, vírgula decimal. */
export const formatRateInput = (rate: number): string => rate.toFixed(4).replace(".", ",")
