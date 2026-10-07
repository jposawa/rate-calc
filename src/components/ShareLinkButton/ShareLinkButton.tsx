import { Button, type BaseComponent } from "@jposawa/ronin-ui"
import clsx from "clsx"
import { useState } from "react"

import { useTranslation } from "@/hooks"
import { buildShareUrl } from "@/services"
import type { FormValues, MessageKey } from "@/types"

import styles from "./ShareLinkButton.module.css"

type ShareLinkButtonProps = BaseComponent & {
  values: FormValues
}

/**
 * Copia um link que abre esta página com o mesmo cálculo — os campos vão
 * codificados no `?share=`.
 *
 * Se a área de transferência for negada, o link vai para a barra de endereço,
 * de onde a pessoa copia à mão.
 */
export const ShareLinkButton = ({ values, className, style }: ShareLinkButtonProps) => {
  const { t } = useTranslation()
  const [status, setStatus] = useState<MessageKey | null>(null)

  const handleCopy = async () => {
    const url = buildShareUrl(values)

    try {
      await navigator.clipboard.writeText(url)
      setStatus("share.copied")
    } catch {
      window.history.replaceState(window.history.state, "", url)
      setStatus("share.failed")
    }
  }

  return (
    <div className={clsx(styles.share, className)} style={style}>
      <Button variant="outline" intent="primary" onClick={handleCopy}>
        {t("share.button")}
      </Button>
      <p className={styles.status} role="status">
        {status && t(status)}
      </p>
    </div>
  )
}
