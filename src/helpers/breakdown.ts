import type { Breakdown, BreakdownInput } from "@/types"

/**
 * O mês, do dólar ao líquido.
 *
 * O spread sai na conversão. O imposto incide, por padrão, sobre o que já
 * chegou em reais, depois do spread; com `isTaxBeforeSpread`, sobre o valor
 * convertido cheio — é o caso de quem emite a nota pela cotação do dia, sem
 * descontar a taxa da plataforma.
 */
export const computeBreakdown = (input: BreakdownInput, isTaxBeforeSpread: boolean): Breakdown => {
  const usd = input.rate * input.hours
  const gross = usd * input.fx
  const spreadCost = (gross * input.spread) / 100
  const afterSpread = gross - spreadCost
  const taxCost = ((isTaxBeforeSpread ? gross : afterSpread) * input.tax) / 100
  const net = afterSpread - taxCost

  return {
    ...input,
    isTaxBeforeSpread,
    usd,
    gross,
    spreadCost,
    afterSpread,
    taxCost,
    net,
    netPerHour: net / input.hours,
  }
}
