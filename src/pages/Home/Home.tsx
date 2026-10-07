import { Input, Switch } from "@jposawa/ronin-ui"

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
  const { values, update, reset, status, fxChecks, recordFxCheck } = useStoredValues()
  const { errors, input } = validateValues(values)
  const breakdown = input ? computeBreakdown(input, values.isTaxBeforeSpread) : null

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
        <LocaleSwitch />
        <p className={styles.intro}>{t("home.intro")}</p>
      </header>

      <form className={styles.form} autoComplete="off" noValidate onSubmit={(event) => event.preventDefault()}>
        <DecimalInput
          decimals={2}
          label={t("field.rate.label")}
          value={values.rate}
          onValueChange={(rate) => update({ rate })}
          errorMessage={errorFor("rate")}
          placeholder={t("field.rate.placeholder")}
        />
        <Input
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
          provider={values.fxProvider}
          checks={fxChecks}
          // Digitou por cima: a origem anterior deixa de valer.
          onValueChange={(fx) => update({ fx, fxMeta: null })}
          onProviderChange={(fxProvider) => update({ fxProvider })}
          onQuote={({ rate, ...fxMeta }) => {
            update({ fx: fmt.rateInput(rate), fxMeta })
            recordFxCheck(fxMeta.source)
          }}
        />

        <Input
          label={t("field.spread.label")}
          value={values.spread}
          onValueChange={(spread) => update({ spread })}
          hint={t("field.spread.hint")}
          errorMessage={errorFor("spread")}
          inputMode="decimal"
          placeholder={t("field.spread.placeholder")}
        />
        {/* O imposto e a base dele ficam juntos: o switch muda o que o campo significa. */}
        <div className={styles.taxField}>
          <Input
            id={TAX_INPUT_ID}
            label={t("field.tax.label")}
            value={values.tax}
            onValueChange={(tax) => update({ tax })}
            hint={t("field.tax.hint")}
            errorMessage={errorFor("tax")}
            inputMode="decimal"
            placeholder="6"
          />
          {/* Ligado é pós spread, o padrão; o rótulo diz a base que vale agora. */}
          <Switch
            label={t(values.isTaxBeforeSpread ? "field.tax.beforeSpread" : "field.tax.afterSpread")}
            hint={t(values.isTaxBeforeSpread ? "field.tax.beforeSpreadHint" : "field.tax.afterSpreadHint")}
            isChecked={!values.isTaxBeforeSpread}
            onToggle={() => update({ isTaxBeforeSpread: !values.isTaxBeforeSpread })}
          />
        </div>

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
