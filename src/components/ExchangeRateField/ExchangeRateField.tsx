import { Button, Input, type BaseComponent } from "@jposawa/ronin-ui"
import clsx from "clsx"
import { useState } from "react"

import { fetchExchangeRate } from "@/services"
import type { FxMeta, FxQuote } from "@/types"

import styles from "./ExchangeRateField.module.css"

type ExchangeRateFieldProps = BaseComponent & {
  value: string
  /** De onde veio o valor do campo; `null` se foi digitado. */
  meta: FxMeta | null
  errorMessage?: string
  onValueChange: (value: string) => void
  onQuote: (quote: FxQuote) => void
}

const describeSource = (meta: FxMeta | null) =>
  meta
    ? `${meta.source}, ${meta.date}. Estimativa; a taxa da sua plataforma pode diferir.`
    : "Valor informado manualmente."

/**
 * O campo da cotação, com o botão que a busca na internet.
 *
 * A origem do valor fica no `hint` do campo — ligada a ele por
 * `aria-describedby` — e o andamento da busca numa linha `role="status"` à
 * parte, para ser anunciado sem a pessoa precisar voltar ao campo.
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
  const [isFetching, setIsFetching] = useState(false)
  const [status, setStatus] = useState("")

  const handleFetch = async () => {
    setIsFetching(true)
    setStatus("Consultando o Banco Central…")

    try {
      onQuote(await fetchExchangeRate(() => setStatus("Fonte indisponível, tentando a próxima…")))
      setStatus("")
    } catch {
      setStatus("Não foi possível buscar a cotação agora. Informe o valor manualmente.")
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <div className={clsx(styles.field, className)} style={style}>
      <Input
        label="Cotação do dólar em R$"
        value={value}
        onValueChange={onValueChange}
        hint={describeSource(meta)}
        errorMessage={errorMessage}
        inputMode="decimal"
        placeholder="4,98"
      />

      <div className={styles.actions}>
        <Button variant="outline" intent="primary" onClick={handleFetch} disabled={isFetching}>
          {isFetching ? "Buscando…" : "Buscar cotação"}
        </Button>
        <p className={styles.status} role="status">
          {status}
        </p>
      </div>
    </div>
  )
}
