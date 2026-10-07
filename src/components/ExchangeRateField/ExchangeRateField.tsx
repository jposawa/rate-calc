import { Button, type BaseComponent } from "@jposawa/ronin-ui"
import clsx from "clsx"
import { useState } from "react"

import { useTranslation } from "@/hooks"
import { fetchExchangeRate } from "@/services"
import type { FxMeta, FxQuote, MessageKey } from "@/types"

import { DecimalInput } from "../DecimalInput"

import styles from "./ExchangeRateField.module.css"

type ExchangeRateFieldProps = BaseComponent & {
  value: string
  /** De onde veio o valor do campo; `null` se foi digitado. */
  meta: FxMeta | null
  errorMessage?: string
  onValueChange: (value: string) => void
  onQuote: (quote: FxQuote) => void
}

/**
 * O campo da cotação, com o botão que a busca na internet.
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
  onValueChange,
  onQuote,
  className,
  style,
}: ExchangeRateFieldProps) => {
  const { t, fmt } = useTranslation()
  const [isFetching, setIsFetching] = useState(false)
  const [status, setStatus] = useState<MessageKey | null>(null)

  const handleFetch = async () => {
    setIsFetching(true)
    setStatus("fx.status.querying")

    try {
      onQuote(await fetchExchangeRate(() => setStatus("fx.status.fallback")))
      setStatus(null)
    } catch {
      setStatus("fx.status.failed")
    } finally {
      setIsFetching(false)
    }
  }

  const hint = meta
    ? t("fx.sourceHint", { source: t(`fx.source.${meta.source}`), date: fmt.quoteDate(meta.date) })
    : t("fx.manual")

  return (
    <div className={clsx(styles.field, className)} style={style}>
      <DecimalInput
        className={styles.input}
        decimals={4}
        label={t("fx.label")}
        value={value}
        onValueChange={onValueChange}
        hint={hint}
        errorMessage={errorMessage}
        placeholder={t("fx.placeholder")}
      />
      <Button variant="outline" intent="primary" onClick={handleFetch} disabled={isFetching}>
        {isFetching ? t("fx.fetching") : t("fx.fetch")}
      </Button>
      <p className={styles.status} role="status">
        {status && t(status)}
      </p>
    </div>
  )
}
