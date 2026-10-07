import { Button, Checkbox, Collapse, type BaseComponent } from "@jposawa/ronin-ui"
import { useState } from "react"

import { computeSimplesRate } from "@/helpers"
import { useTranslation } from "@/hooks"

import { DecimalInput } from "../DecimalInput"

import styles from "./TaxRateHelper.module.css"

type TaxRateHelperProps = BaseComponent & {
  rbt12: string
  isExport: boolean
  onRbt12Change: (value: string) => void
  onExportChange: (isExport: boolean) => void
  /** Recebe a alíquota final, em %. */
  onApply: (rate: number) => void
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
  const { t, fmt } = useTranslation()
  const [isOpen, setIsOpen] = useState(() => rbt12 !== "" || isExport)
  const result = computeSimplesRate(rbt12, isExport)

  const describeResult = (): React.ReactNode => {
    switch (result.kind) {
      case "empty":
        return t("simples.empty")
      case "invalid":
        return t("simples.invalid")
      case "aboveLimit":
        return t("simples.aboveLimit")
      case "ok":
        return (
          <>
            {t("simples.band", { band: result.band })} {t("simples.effective")}{" "}
            <strong>{fmt.percent(result.effectiveRate)}%</strong>.
            {isExport && (
              <>
                {" "}
                {t("simples.exportRate")} <strong>{fmt.percent(result.finalRate)}%</strong>.
              </>
            )}
          </>
        )
    }
  }

  return (
    <Collapse
      className={className}
      style={style}
      title={t("simples.title")}
      isOpen={isOpen}
      onToggle={() => setIsOpen((open) => !open)}
    >
      {/* `fieldset`: são os controles de um mesmo cálculo, dentro do formulário. */}
      <fieldset className={styles.body}>
        <DecimalInput
          decimals={2}
          label={t("simples.rbt12.label")}
          value={rbt12}
          onValueChange={onRbt12Change}
          hint={t("simples.rbt12.hint")}
          placeholder={t("simples.rbt12.placeholder")}
        />

        <Checkbox label={t("simples.export")} checked={isExport} onCheckedChange={onExportChange} />

        <p className={styles.output} aria-live="polite">
          {describeResult()}
        </p>

        <Button
          className={styles.apply}
          variant="outline"
          intent="primary"
          disabled={result.kind !== "ok"}
          onClick={() => result.kind === "ok" && onApply(result.finalRate)}
        >
          {t("simples.apply")}
        </Button>

        <p className={styles.note}>{t("simples.note")}</p>
      </fieldset>
    </Collapse>
  )
}
