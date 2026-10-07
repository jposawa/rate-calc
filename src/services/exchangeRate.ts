import { FX_TIMEOUT_MS, ONLINE_FX_SOURCES } from "@/constants"
import type { FxProvider, FxQuote, OnlineFxSource } from "@/types"

const pad = (value: number | string) => String(value).padStart(2, "0")

/** "2026-10-07 13:05:12" → "2026-10-07 13:05", o formato de `FxMeta.date`. Sem hora, só a data. */
const toQuoteDate = (raw: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:[\sT](\d{2}):(\d{2}))?/.exec(raw)

  if (!match) {
    return raw
  }

  const [, year, month, day, hour, minute] = match
  const date = `${year}-${month}-${day}`

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
    source: "ptax",
    date: toQuoteDate(quote.dataHoraCotacao),
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
    source: "awesome",
    date: toQuoteDate(data.USDBRL.create_date),
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

  return { rate, source: "frankfurter", date: toQuoteDate(data.date) }
}

/** Cada fonte pela sua chave; a ordem da busca automática fica em `ONLINE_FX_SOURCES`. */
const SOURCES: Record<OnlineFxSource, () => Promise<FxQuote>> = {
  ptax: fromCentralBank,
  awesome: fromAwesomeApi,
  frankfurter: fromFrankfurter,
}

/**
 * A cotação de compra do dólar.
 *
 * Com uma fonte escolhida, só ela é consultada. Na automática, vale a primeira
 * que responder, na ordem de `ONLINE_FX_SOURCES`; `onFallback` recebe a
 * próxima fonte quando uma falha — é o que deixa a tela dizer o que está
 * acontecendo em vez de parecer travada.
 */
export const fetchExchangeRate = async (
  provider: FxProvider,
  onFallback?: (next: OnlineFxSource) => void,
): Promise<FxQuote> => {
  if (provider !== "auto") {
    return SOURCES[provider]()
  }

  for (const [index, source] of ONLINE_FX_SOURCES.entries()) {
    try {
      return await SOURCES[source]()
    } catch {
      const next = ONLINE_FX_SOURCES[index + 1]

      if (next) {
        onFallback?.(next)
      }
    }
  }

  throw new Error("Nenhuma fonte de cotação respondeu.")
}
