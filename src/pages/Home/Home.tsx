import { Input } from "@jposawa/ronin-ui"

import { ClearDataButton, ExchangeRateField, ResultSummary, TaxRateHelper } from "@/components"
import { computeBreakdown, formatPercent, formatRateInput, validateValues } from "@/helpers"
import { useStoredValues } from "@/hooks"

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
  const { values, update, reset, status } = useStoredValues()
  const { errors, input } = validateValues(values)
  const breakdown = input ? computeBreakdown(input) : null

  const applyTaxRate = (rate: number) => {
    update({ tax: formatPercent(rate) })
    document.getElementById(TAX_INPUT_ID)?.focus()
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Do valor/hora em dólar ao líquido em reais</h1>
      <p className={styles.lede}>
        Informe o valor/hora e as horas do mês. O cálculo desconta o spread do câmbio e depois o
        imposto da nota. Os valores ficam salvos neste navegador.
      </p>

      <div className={styles.layout}>
        <form className={styles.form} autoComplete="off" noValidate onSubmit={(event) => event.preventDefault()}>
          <div className={styles.pair}>
            <Input
              label="Valor/hora em US$"
              value={values.rate}
              onValueChange={(rate) => update({ rate })}
              errorMessage={errors.rate}
              inputMode="decimal"
              placeholder="45,00"
            />
            <Input
              label="Horas no mês"
              value={values.hours}
              onValueChange={(hours) => update({ hours })}
              errorMessage={errors.hours}
              inputMode="decimal"
              placeholder="160"
            />
          </div>

          <ExchangeRateField
            value={values.fx}
            meta={values.fxMeta}
            errorMessage={errors.fx}
            // Digitou por cima: a origem anterior deixa de valer.
            onValueChange={(fx) => update({ fx, fxMeta: null })}
            onQuote={({ rate, ...fxMeta }) => update({ fx: formatRateInput(rate), fxMeta })}
          />

          <div className={styles.pair}>
            <Input
              label="Spread em % (opcional)"
              value={values.spread}
              onValueChange={(spread) => update({ spread })}
              hint="Padrão: 0,5%. Vazio conta como 0%."
              errorMessage={errors.spread}
              inputMode="decimal"
              placeholder="0,5"
            />
            <Input
              id={TAX_INPUT_ID}
              label="Imposto da nota em % (opcional)"
              value={values.tax}
              onValueChange={(tax) => update({ tax })}
              hint="Padrão: 6%, Simples Nacional, Anexo III, 1ª faixa."
              errorMessage={errors.tax}
              inputMode="decimal"
              placeholder="6"
            />
          </div>

          <TaxRateHelper
            rbt12={values.rbt12}
            isExport={values.isExport}
            onRbt12Change={(rbt12) => update({ rbt12 })}
            onExportChange={(isExport) => update({ isExport })}
            onApply={applyTaxRate}
          />
        </form>

        <ResultSummary className={styles.result} breakdown={breakdown} />
      </div>

      <div className={styles.footer}>
        <ClearDataButton onConfirm={reset} />
        <p className={styles.status} role="status">
          {status}
        </p>
      </div>
    </main>
  )
}
