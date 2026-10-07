import { Card, type BaseComponent } from "@jposawa/ronin-ui"

import { useTranslation } from "@/hooks"
import type { Breakdown } from "@/types"

import { Ledger } from "../Ledger"
import { SplitDonut } from "../SplitDonut"

import styles from "./ResultSummary.module.css"

type ResultSummaryProps = BaseComponent & {
  /** `null` enquanto o formulário estiver incompleto ou com erro. */
  breakdown: Breakdown | null
  /** Vai no rodapé do card, e só quando há resultado. */
  actions?: React.ReactNode
}

const COLORS = {
  net: "var(--color-net)",
  tax: "var(--color-tax)",
  spread: "var(--color-spread)",
}

/** O mês calculado: a conta passo a passo, o líquido em destaque e para onde foi cada parte. */
export const ResultSummary = ({ breakdown, actions, className, style }: ResultSummaryProps) => {
  const { t } = useTranslation()

  return (
    <Card
      className={className}
      style={style}
      header={<h2 className={styles.title}>{t("result.title")}</h2>}
      footer={breakdown && actions}
    >
      <div className={styles.body} aria-live="polite">
        {breakdown ? <Result breakdown={breakdown} /> : <p className={styles.empty}>{t("result.empty")}</p>}
      </div>
    </Card>
  )
}

const Result = ({ breakdown: b }: { breakdown: Breakdown }) => {
  const { t, fmt } = useTranslation()
  // Percentuais sobre o convertido sem spread: é o "todo" que o spread e o
  // imposto dividem com o líquido, e as três fatias somam 100.
  const share = (amount: number) => (amount / b.gross) * 100
  const netShare = share(b.net)

  return (
    <>
      <Ledger
        lines={[
          { label: t("result.totalUsd"), value: fmt.usd(b.usd) },
          { label: t("result.gross", { fx: fmt.brl(b.fx) }), value: fmt.brl(b.gross), tone: "sub" },
          {
            label: t("result.spread", { percent: fmt.percent(b.spread) }),
            value: `− ${fmt.brl(b.spreadCost)}`,
            tone: "sub",
            color: COLORS.spread,
          },
          { label: t("result.afterSpread"), value: fmt.brl(b.afterSpread) },
          {
            label: t(b.isTaxBeforeSpread ? "result.taxBeforeSpread" : "result.tax", { percent: fmt.percent(b.tax) }),
            value: `− ${fmt.brl(b.taxCost)}`,
            tone: "sub",
            color: COLORS.tax,
          },
        ]}
      />

      <p className={styles.netTotal}>
        <span className={styles.netLabel}>{t("result.net")}</span>
        <strong className={styles.netValue}>{fmt.brl(b.net)}</strong>
        <span className={styles.perHour}>{t("result.perHour", { amount: fmt.brl(b.netPerHour) })}</span>
      </p>

      <SplitDonut
        className={styles.chart}
        center={{ value: `${fmt.percent(netShare, 1)}%`, label: t("result.netShort") }}
        description={t("result.splitDescription")}
        parts={[
          { label: t("result.part.net"), percent: netShare, amount: fmt.brl(b.net), color: COLORS.net },
          { label: t("result.part.tax"), percent: share(b.taxCost), amount: fmt.brl(b.taxCost), color: COLORS.tax },
          {
            label: t("result.part.spread"),
            percent: share(b.spreadCost),
            amount: fmt.brl(b.spreadCost),
            color: COLORS.spread,
          },
        ]}
        note={t(b.isTaxBeforeSpread ? "result.noteBeforeSpread" : "result.note")}
      />
    </>
  )
}
