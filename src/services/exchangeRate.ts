import { FX_TIMEOUT_MS } from "@/constants"
import type { FxQuote } from "@/types"

const pad = (value: number | string) => String(value).padStart(2, "0")

/** "2026-10-07 13:05:12" → "07/10/2026 13:05". Sem hora, só a data. */
const toBrazilianDate = (raw: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:[\sT](\d{2}):(\d{2}))?/.exec(raw)

  if (!match) {
    return raw
  }

  const [, year, month, day, hour, minute] = match
  const date = `${day}/${month}/${year}`

  return hour ? `${date} ${hour}:${minute}` : date
}

const getJSON = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, { signal: AbortSignal.timeout(FX_TIMEOUT_MS), cache: "no-store" })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json() as Promise<T>
}

/**
 * Banco Central — PTAX, pela API Olinda. Compra: a taxa pela qual o banco
 * compra os seus dólares, que é o lado de quem recebe do exterior.
 *
 * Pede os últimos dez dias e fica com o mais recente, porque fim de semana e
 * feriado não têm boletim.
 */
const fromCentralBank = async (): Promise<FxQuote> => {
  const end = new Date()
  const start = new Date(end.getTime() - 10 * 86_400_000)
  const usDate = (date: Date) => `${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${date.getFullYear()}`

  const url =
    "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/" +
    "CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)" +
    `?@dataInicial=%27${usDate(start)}%27&@dataFinalCotacao=%27${usDate(end)}%27` +
    "&$orderby=dataHoraCotacao%20desc&$top=1&$format=json"

  const data = await getJSON<{ value?: { cotacaoCompra: number; dataHoraCotacao: string }[] }>(url)
  const quote = data.value?.[0]

  if (!quote || !(quote.cotacaoCompra > 0)) {
    throw new Error("sem dados")
  }

  return {
    rate: quote.cotacaoCompra,
    source: "PTAX compra, Banco Central",
    date: toBrazilianDate(quote.dataHoraCotacao),
  }
}

/** AwesomeAPI — câmbio comercial quase em tempo real, não oficial. `bid` é compra. */
const fromAwesomeApi = async (): Promise<FxQuote> => {
  const data = await getJSON<{ USDBRL?: { bid: string; create_date: string } }>(
    "https://economia.awesomeapi.com.br/json/last/USD-BRL",
  )
  const rate = Number(data.USDBRL?.bid)

  if (!data.USDBRL || !(rate > 0)) {
    throw new Error("sem dados")
  }

  return {
    rate,
    source: "Comercial compra, AwesomeAPI",
    date: toBrazilianDate(data.USDBRL.create_date),
  }
}

/** Frankfurter — referência diária do BCE, cruzada via euro. */
const fromFrankfurter = async (): Promise<FxQuote> => {
  const data = await getJSON<{ date: string; rates?: { BRL?: number } }>(
    "https://api.frankfurter.app/latest?from=USD&to=BRL",
  )
  const rate = Number(data.rates?.BRL)

  if (!(rate > 0)) {
    throw new Error("sem dados")
  }

  return { rate, source: "Referência BCE, Frankfurter", date: toBrazilianDate(data.date) }
}

/** Em ordem de preferência: a oficial primeiro, as de reserva depois. */
const SOURCES = [fromCentralBank, fromAwesomeApi, fromFrankfurter]

/**
 * A cotação de compra do dólar, da primeira fonte que responder.
 *
 * `onFallback` avisa quando uma fonte falha e a próxima vai ser tentada — é o
 * que deixa a tela dizer o que está acontecendo em vez de parecer travada.
 */
export const fetchExchangeRate = async (onFallback?: () => void): Promise<FxQuote> => {
  for (const [index, source] of SOURCES.entries()) {
    try {
      return await source()
    } catch {
      if (index < SOURCES.length - 1) {
        onFallback?.()
      }
    }
  }

  throw new Error("Nenhuma fonte de cotação respondeu.")
}
