import type { BaseComponent } from "@jposawa/ronin-ui"
import clsx from "clsx"

import { useTranslation } from "@/hooks"

import styles from "./SplitDonut.module.css"

export type SplitPart = {
  label: string
  /** De 0 a 100. */
  percent: number
  /** Já formatado — o gráfico não sabe a moeda. */
  amount: string
  /** Qualquer cor CSS, inclusive `var(--token)`. */
  color: string
}

type SplitDonutProps = BaseComponent & {
  parts: SplitPart[]
  /** O destaque no meio do anel, ex.: `{ value: "87,3%", label: "líquido" }`. */
  center: { value: string; label: string }
  /** Sobre o que são os percentuais — completa o nome acessível do gráfico. */
  description: string
  note?: React.ReactNode
}

/**
 * Circunferência 100: com esse raio, o `stroke-dasharray` de cada fatia é o
 * próprio percentual, sem conversão.
 */
const RADIUS = 15.9155

/**
 * Anel com as fatias de um todo e a legenda ao lado.
 *
 * As cores vão por `style` e não por atributo do SVG: atributo de apresentação
 * não resolve `var()`, e é por token que o gráfico acompanha o tema claro e o
 * escuro sem precisar redesenhar.
 */
export const SplitDonut = ({ parts, center, description, note, className, style }: SplitDonutProps) => {
  const { fmt } = useTranslation()
  const offsets = parts.map((_, index) =>
    parts.slice(0, index).reduce((sum, part) => sum + Math.max(0, part.percent), 0),
  )
  const accessibleName = `${parts.map((part) => `${part.label} ${fmt.percent(part.percent, 2)}%`).join(", ")} ${description}`

  return (
    <figure className={clsx(styles.chart, className)} style={style}>
      <div className={styles.donut} role="img" aria-label={accessibleName}>
        <svg className={styles.ring} viewBox="0 0 42 42" aria-hidden="true">
          <circle className={styles.slice} cx="21" cy="21" r={RADIUS} style={{ stroke: "var(--color-border)" }} />
          {parts.map((part, index) => {
            const percent = Math.max(0, part.percent)

            return (
              <circle
                key={part.label}
                className={styles.slice}
                cx="21"
                cy="21"
                r={RADIUS}
                style={{ stroke: part.color }}
                strokeDasharray={`${percent} ${100 - percent}`}
                strokeDashoffset={-offsets[index]}
              />
            )
          })}
        </svg>
        <p className={styles.centerText}>
          <strong className={styles.centerValue}>{center.value}</strong>
          <span className={styles.centerLabel}>{center.label}</span>
        </p>
      </div>

      <ul className={styles.legend}>
        {parts.map((part) => (
          <li key={part.label} className={styles.legendItem}>
            <span className={styles.colorDot} style={{ background: part.color }} aria-hidden="true" />
            <span>{part.label}</span>
            <span className={styles.percent}>{fmt.percent(part.percent, 2)}%</span>
            <span className={styles.amount}>{part.amount}</span>
          </li>
        ))}
      </ul>

      {note && <figcaption className={styles.note}>{note}</figcaption>}
    </figure>
  )
}
