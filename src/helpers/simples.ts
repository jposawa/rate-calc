import { ANEXO_III } from "@/constants"
import type { SimplesResult } from "@/types"

import { parseAmount } from "./number"

/**
 * Alíquota efetiva do Anexo III a partir da receita bruta dos últimos 12 meses.
 *
 * Assume que o Fator R mantém a empresa no Anexo III. Na exportação de serviço,
 * PIS, COFINS e ISS saem da alíquota pela fatia que cada um tem na repartição.
 */
export const computeSimplesRate = (rbt12Raw: string, isExport: boolean): SimplesResult => {
  if (rbt12Raw.trim() === "") {
    return { kind: "empty" }
  }

  const revenue = parseAmount(rbt12Raw)

  if (!(revenue >= 0)) {
    return { kind: "invalid" }
  }

  const bandIndex = ANEXO_III.findIndex((band) => revenue <= band.max)

  if (bandIndex === -1) {
    return { kind: "aboveLimit" }
  }

  const band = ANEXO_III[bandIndex]
  const effective = revenue > 0 ? (revenue * band.rate - band.deduction) / revenue : band.rate
  const final = isExport
    ? effective * (1 - band.share.cofins - band.share.pis - band.share.iss)
    : effective

  return {
    kind: "ok",
    band: bandIndex + 1,
    effectiveRate: effective * 100,
    finalRate: Math.round(final * 100 * 1000) / 1000,
  }
}
