import type { BaseComponent } from "@jposawa/ronin-ui"
import clsx from "clsx"
import { Fragment } from "react"

import styles from "./Ledger.module.css"

export type LedgerLine = {
  label: string
  value: string
  /** `key` é um subtotal, em destaque; `sub` é um passo da conta, mais discreto. */
  tone?: "key" | "sub"
  /** Cor da amostra ao lado do rótulo — liga a linha à fatia do gráfico. */
  color?: string
}

type LedgerProps = BaseComponent & {
  lines: LedgerLine[]
}

/**
 * Uma conta linha a linha: rótulo à esquerda, valor à direita.
 *
 * `dt` e `dd` são filhos diretos do `dl`, que é a grade de duas colunas — sem
 * um embrulho por linha.
 */
export const Ledger = ({ lines, className, style }: LedgerProps) => (
  <dl className={clsx(styles.ledger, className)} style={style}>
    {lines.map(({ label, value, tone = "key", color }) => (
      <Fragment key={label}>
        <dt className={styles.label} data-tone={tone}>
          {color && <span className={styles.colorDot} style={{ background: color }} aria-hidden="true" />}
          {label}
        </dt>
        <dd className={styles.value} data-tone={tone}>
          {value}
        </dd>
      </Fragment>
    ))}
  </dl>
)
