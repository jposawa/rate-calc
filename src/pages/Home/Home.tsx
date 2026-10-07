import { Input } from "@jposawa/ronin-ui"

import {
  ClearDataButton,
  DecimalInput,
  ExchangeRateField,
  LocaleSwitch,
  ResultSummary,
  ShareLinkButton,
  TaxRateHelper,
} from "@/components"
import { computeBreakdown, validateValues } from "@/helpers"
import { useStoredValues, useTranslation } from "@/hooks"
import type { NumericField } from "@/types"

import styles from "./Home.module.css"

/** Para onde o foco vai quando a calculadora do Anexo III preenche o imposto. */
const TAX_INPUT_ID = "tax"

/**
 * A calculadora: do valor/hora em dólar ao líquido em reais.
 *
 * O resultado é derivado a cada render, não guardado em estado — é barato, e
 * assim não tem como ficar defasado em relação ao formulário.
 */
export const Home = () => {
  const { t, fmt } = useTranslation()
  const { values, update, reset, status } = useStoredValues()
  const { errors, input } = validateValues(values)
  const breakdown = input ? computeBreakdown(input) : null

  const errorFor = (field: NumericField) => {
    const key = errors[field]

    return key && t(key)
  }

  const applyTaxRate = (rate: number) => {
    update({ tax: fmt.percent(rate) })
    document.getElementById(TAX_INPUT_ID)?.focus()
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("home.title")}</h1>
        <LocaleSwitch className={styles.locale} />
        <p className={styles.intro}>{t("home.intro")}</p>
      </header>

      <form className={styles.form} autoComplete="off" noValidate onSubmit={(event) => event.preventDefault()}>
        <DecimalInput
          className={styles.halfWidth}
          decimals={2}
          label={t("field.rate.label")}
          value={values.rate}
          onValueChange={(rate) => update({ rate })}
          errorMessage={errorFor("rate")}
          placeholder={t("field.rate.placeholder")}
        />
        <Input
          className={styles.halfWidth}
          label={t("field.hours.label")}
          value={values.hours}
          onValueChange={(hours) => update({ hours })}
          errorMessage={errorFor("hours")}
          inputMode="decimal"
          placeholder="160"
        />

        <ExchangeRateField
          className={styles.fullWidth}
          value={values.fx}
          meta={values.fxMeta}
          errorMessage={errorFor("fx")}
          // Digitou por cima: a origem anterior deixa de valer.
          onValueChange={(fx) => update({ fx, fxMeta: null })}
          onQuote={({ rate, ...fxMeta }) => update({ fx: fmt.rateInput(rate), fxMeta })}
        />

        <Input
          className={styles.halfWidth}
          label={t("field.spread.label")}
          value={values.spread}
          onValueChange={(spread) => update({ spread })}
          hint={t("field.spread.hint")}
          errorMessage={errorFor("spread")}
          inputMode="decimal"
          placeholder={t("field.spread.placeholder")}
        />
        <Input
          id={TAX_INPUT_ID}
          className={styles.halfWidth}
          label={t("field.tax.label")}
          value={values.tax}
          onValueChange={(tax) => update({ tax })}
          hint={t("field.tax.hint")}
          errorMessage={errorFor("tax")}
          inputMode="decimal"
          placeholder="6"
        />

        <TaxRateHelper
          className={styles.fullWidth}
          rbt12={values.rbt12}
          isExport={values.isExport}
          onRbt12Change={(rbt12) => update({ rbt12 })}
          onExportChange={(isExport) => update({ isExport })}
          onApply={applyTaxRate}
        />
      </form>

      <ResultSummary
        className={styles.result}
        breakdown={breakdown}
        actions={<ShareLinkButton values={values} />}
      />

      <footer className={styles.footer}>
        <ClearDataButton onConfirm={reset} />
        <p className={styles.status} role="status">
          {status}
        </p>
      </footer>
    </main>
  )
}
