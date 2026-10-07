import { Card, type BaseComponent } from "@jposawa/ronin-ui"

import { formatBRL, formatPercent, formatUSD } from "@/helpers"
import type { Breakdown } from "@/types"

import { Ledger } from "../Ledger"
import { SplitDonut } from "../SplitDonut"

import styles from "./ResultSummary.module.css"

type ResultSummaryProps = BaseComponent & {
  /** `null` enquanto o formulário estiver incompleto ou com erro. */
  breakdown: Breakdown | null
}

const COLORS = {
  net: "var(--color-net)",
  tax: "var(--color-tax)",
  spread: "var(--color-spread)",
}

/** O mês calculado: a conta passo a passo, o líquido em destaque e para onde foi cada parte. */
export const ResultSummary = ({ breakdown, className, style }: ResultSummaryProps) => (
  <Card className={className} style={style} header={<h2 className={styles.title}>Resultado do mês</h2>}>
    <div aria-live="polite">
      {breakdown ? (
        <Result breakdown={breakdown} />
      ) : (
        <p className={styles.empty}>Preencha valor/hora, horas e cotação para ver o resultado.</p>
      )}
    </div>
  </Card>
)

const Result = ({ breakdown: b }: { breakdown: Breakdown }) => {
  // Percentuais sobre o convertido sem spread: é o "todo" que o spread e o
  // imposto dividem com o líquido, e as três fatias somam 100.
  const share = (amount: number) => (amount / b.gross) * 100
  const netShare = share(b.net)

  return (
    <>
      <Ledger
        lines={[
          { label: "Total em USD", value: formatUSD(b.usd) },
          { label: `Convertido sem spread (× ${formatBRL(b.fx)})`, value: formatBRL(b.gross), tone: "sub" },
          {
            label: `Spread (${formatPercent(b.spread)}%)`,
            value: `− ${formatBRL(b.spreadCost)}`,
            tone: "sub",
            color: COLORS.spread,
          },
          { label: "BRL pós spread", value: formatBRL(b.afterSpread) },
          {
            label: `Imposto da nota (${formatPercent(b.tax)}%)`,
            value: `− ${formatBRL(b.taxCost)}`,
            tone: "sub",
            color: COLORS.tax,
          },
        ]}
      />

      <div className={styles.net}>
        <p className={styles.netLabel}>BRL pós imposto</p>
        <p className={styles.netValue}>{formatBRL(b.net)}</p>
        <p className={styles.perHour}>{formatBRL(b.netPerHour)} por hora, líquido.</p>
      </div>

      <SplitDonut
        className={styles.split}
        center={{ value: `${formatPercent(netShare, 1)}%`, label: "líquido" }}
        description="do valor convertido sem spread"
        parts={[
          { label: "Líquido", percent: netShare, amount: formatBRL(b.net), color: COLORS.net },
          { label: "Imposto", percent: share(b.taxCost), amount: formatBRL(b.taxCost), color: COLORS.tax },
          { label: "Spread", percent: share(b.spreadCost), amount: formatBRL(b.spreadCost), color: COLORS.spread },
        ]}
        note="Percentuais sobre o valor convertido sem spread. O imposto incide sobre o valor já convertido, após o spread."
      />
    </>
  )
}
