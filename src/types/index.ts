/** De onde veio a cotação e quando — o que aparece embaixo do campo. */
export type FxMeta = {
  source: string
  date: string
}

export type FxQuote = FxMeta & {
  rate: number
}

/**
 * O formulário como o usuário digitou: texto, não número.
 *
 * É texto de propósito. "4," no meio da digitação não é número válido, e
 * converter a cada tecla apagaria o que a pessoa está escrevendo. A conversão
 * acontece só na hora de calcular — `helpers/validation.ts`.
 */
export type FormValues = {
  rate: string
  hours: string
  fx: string
  spread: string
  tax: string
  rbt12: string
  isExport: boolean
  /** `null` quando a cotação foi digitada à mão. */
  fxMeta: FxMeta | null
}

export type NumericField = "rate" | "hours" | "fx" | "spread" | "tax"

export type FieldErrors = Partial<Record<NumericField, string>>

/** Os números que o cálculo precisa, já validados. Percentuais de 0 a 100. */
export type BreakdownInput = Record<NumericField, number>

export type Breakdown = BreakdownInput & {
  usd: number
  /** Convertido pela cotação cheia, antes do spread. Base dos percentuais. */
  gross: number
  spreadCost: number
  afterSpread: number
  taxCost: number
  net: number
  netPerHour: number
}

/** Uma faixa do Anexo III do Simples Nacional. */
export type SimplesBand = {
  /** Teto da receita bruta dos últimos 12 meses, em reais. */
  max: number
  /** Alíquota nominal, de 0 a 1. */
  rate: number
  /** Parcela a deduzir, em reais. */
  deduction: number
  /** Repartição dos tributos que a exportação de serviço exclui. */
  share: { cofins: number; pis: number; iss: number }
}

export type SimplesResult =
  | { kind: "empty" }
  | { kind: "invalid" }
  | { kind: "aboveLimit" }
  | {
      kind: "ok"
      /** 1 a 4. */
      band: number
      /** Alíquota efetiva, em %. */
      effectiveRate: number
      /** A alíquota a usar na nota, em % com três casas — sem PIS, COFINS e ISS se for exportação. */
      finalRate: number
    }
