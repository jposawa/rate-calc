import { Button, Select, type BaseComponent, type SelectOption } from "@jposawa/ronin-ui"
import clsx from "clsx"
import { useState } from "react"

import { FX_PROVIDERS } from "@/constants"
import { useTranslation } from "@/hooks"
import { fetchExchangeRate } from "@/services"
import type { FxChecks, FxMeta, FxProvider, FxQuote, MessageKey, OnlineFxSource } from "@/types"

import { DecimalInput } from "../DecimalInput"

import styles from "./ExchangeRateField.module.css"

type ExchangeRateFieldProps = BaseComponent & {
  value: string
  /** De onde veio o valor do campo; `null` se foi digitado. */
  meta: FxMeta | null
  errorMessage?: string
  provider: FxProvider
  /** Quando cada fonte respondeu pela última vez — aparece na opção dela. */
  checks: FxChecks
  onValueChange: (value: string) => void
  onProviderChange: (provider: FxProvider) => void
  onQuote: (quote: FxQuote) => void
}

/** O andamento da busca, guardado como chave para acompanhar a troca de idioma. */
type FetchStatus = { key: MessageKey; source?: OnlineFxSource } | null

/**
 * O campo da cotação, com a escolha da fonte e o botão que a busca na internet.
 *
 * A origem do valor fica no `hint` do campo — ligada a ele por
 * `aria-describedby` — e o andamento da busca numa linha `role="status"` à
 * parte, para ser anunciado sem a pessoa precisar voltar ao campo.
 *
 * Quatro casas, como as cotações que as fontes devolvem.
 */
export const ExchangeRateField = ({
  value,
  meta,
  errorMessage,
  provider,
  checks,
  onValueChange,
  onProviderChange,
  onQuote,
  className,
  style,
}: ExchangeRateFieldProps) => {
  const { t, fmt } = useTranslation()
  const [isFetching, setIsFetching] = useState(false)
  const [status, setStatus] = useState<FetchStatus>(null)

  const handleFetch = async () => {
    setIsFetching(true)
    // A automática começa pelo Banco Central.
    setStatus({ key: "fx.status.querying", source: provider === "auto" ? "ptax" : provider })

    try {
      onQuote(await fetchExchangeRate(provider, (next) => setStatus({ key: "fx.status.fallback", source: next })))
      setStatus(null)
    } catch {
      setStatus({ key: "fx.status.failed" })
    } finally {
      setIsFetching(false)
    }
  }

  const hint = meta
    ? t("fx.sourceHint", { source: t(`fx.source.${meta.source}`), date: fmt.quoteDate(meta.date) })
    : t("fx.manual")

  const describeProvider = (option: FxProvider): string => {
    if (option === "auto") {
      return t("fx.provider.auto")
    }

    const source = t(`fx.source.${option}`)
    const checkedAt = checks[option]

    return checkedAt ? t("fx.provider.checked", { source, date: fmt.dateTime(checkedAt) }) : source
  }

  const providerOptions: SelectOption[] = FX_PROVIDERS.map((option) => ({
    value: option,
    label: describeProvider(option),
  }))

  return (
    <div className={clsx(styles.field, className)} style={style}>
      <DecimalInput
        className={styles.fullWidth}
        decimals={4}
        label={t("fx.label")}
        value={value}
        onValueChange={onValueChange}
        hint={hint}
        errorMessage={errorMessage}
        placeholder={t("fx.placeholder")}
      />
      <Select
        className={styles.provider}
        label={t("fx.provider.label")}
        options={providerOptions}
        value={provider}
        onValueChange={(next) => onProviderChange(next as FxProvider)}
      />
      <Button variant="outline" intent="primary" onClick={handleFetch} disabled={isFetching}>
        {isFetching ? t("fx.fetching") : t("fx.fetch")}
      </Button>
      <p className={styles.status} role="status">
        {status && t(status.key, { source: status.source ? t(`fx.source.${status.source}`) : "" })}
      </p>
    </div>
  )
}
