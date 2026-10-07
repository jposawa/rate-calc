import type { Breakdown, BreakdownInput } from "@/types"

/**
 * O mês, do dólar ao líquido.
 *
 * A ordem importa: o spread sai na conversão e o imposto incide sobre o que já
 * chegou em reais, depois do spread — é sobre esse valor que a nota é emitida.
 */
export const computeBreakdown = (input: BreakdownInput): Breakdown => {
  const usd = input.rate * input.hours
  const gross = usd * input.fx
  const spreadCost = (gross * input.spread) / 100
  const afterSpread = gross - spreadCost
  const taxCost = (afterSpread * input.tax) / 100
  const net = afterSpread - taxCost

  return {
    ...input,
    usd,
    gross,
    spreadCost,
    afterSpread,
    taxCost,
    net,
    netPerHour: net / input.hours,
  }
}
