import { Button, Checkbox, Collapse, Input, type BaseComponent } from "@jposawa/ronin-ui"
import { useState } from "react"

import { computeSimplesRate, formatPercent } from "@/helpers"
import type { SimplesResult } from "@/types"

import styles from "./TaxRateHelper.module.css"

type TaxRateHelperProps = BaseComponent & {
  rbt12: string
  isExport: boolean
  onRbt12Change: (value: string) => void
  onExportChange: (isExport: boolean) => void
  /** Recebe a alíquota final, em %. */
  onApply: (rate: number) => void
}

const describeResult = (result: SimplesResult, isExport: boolean): React.ReactNode => {
  switch (result.kind) {
    case "empty":
      return "Informe a receita bruta para calcular."
    case "invalid":
      return "A receita bruta precisa ser um número."
    case "aboveLimit":
      return "Acima de R$ 1,8 milhão. Informe a alíquota manualmente no campo de imposto."
    case "ok":
      return (
        <>
          Faixa {result.band}. Alíquota efetiva: <strong>{formatPercent(result.effectiveRate)}%</strong>.
          {isExport && (
            <>
              {" "}
              Sem PIS, COFINS e ISS: <strong>{formatPercent(result.finalRate)}%</strong>.
            </>
          )}
        </>
      )
  }
}

/**
 * Calculadora da alíquota do Simples Nacional, Anexo III, recolhida por padrão.
 *
 * Abre sozinha se já há o que mostrar — receita ou exportação vindas do último
 * uso —, para a pessoa não achar que o dado salvo se perdeu.
 */
export const TaxRateHelper = ({
  rbt12,
  isExport,
  onRbt12Change,
  onExportChange,
  onApply,
  className,
  style,
}: TaxRateHelperProps) => {
  const [isOpen, setIsOpen] = useState(() => rbt12 !== "" || isExport)
  const result = computeSimplesRate(rbt12, isExport)

  return (
    <Collapse
      className={className}
      style={style}
      title="Calcular a alíquota do Anexo III"
      isOpen={isOpen}
      onToggle={() => setIsOpen((open) => !open)}
    >
      <div className={styles.body}>
        <Input
          label="Receita bruta dos últimos 12 meses em R$"
          value={rbt12}
          onValueChange={onRbt12Change}
          hint="Usada para definir a faixa e a alíquota efetiva."
          inputMode="decimal"
          placeholder="250000"
        />

        <Checkbox
          label="Exportação de serviço (exclui PIS, COFINS e ISS da alíquota)"
          checked={isExport}
          onCheckedChange={onExportChange}
        />

        <p className={styles.output} aria-live="polite">
          {describeResult(result, isExport)}
        </p>

        <div>
          <Button
            variant="outline"
            intent="primary"
            disabled={result.kind !== "ok"}
            onClick={() => result.kind === "ok" && onApply(result.finalRate)}
          >
            Usar esta alíquota
          </Button>
        </div>

        <p className={styles.note}>
          Considera as faixas 1 a 4 (até R$ 1,8 milhão) e assume que o Fator R mantém você no Anexo III.
          Confirme com seu contador.
        </p>
      </div>
    </Collapse>
  )
}
