import { Button, Popover, type BaseComponent } from "@jposawa/ronin-ui"
import { useRef, useState } from "react"

import { useTranslation } from "@/hooks"

import styles from "./ClearDataButton.module.css"

type ClearDataButtonProps = BaseComponent & {
  onConfirm: () => void
}

/**
 * "Apagar dados salvos", com confirmação num popover.
 *
 * Apagar não tem volta, então pede um segundo clique — mas num popover, e não
 * num modal: é uma decisão pequena, que não precisa travar a página.
 *
 * O foco volta para o botão ao fechar, por qualquer caminho. O Escape a
 * biblioteca já devolve; o Cancelar e o Apagar desmontam o painel com o foco
 * dentro dele, e sem isto o foco cairia no `body`. O botão é guardado no
 * clique que abre o painel — o `Button` da biblioteca não aceita `ref`.
 */
export const ClearDataButton = ({ onConfirm, className, style }: ClearDataButtonProps) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const close = () => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  const confirm = () => {
    onConfirm()
    close()
  }

  return (
    <Popover
      title={t("clear.title")}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="top-start"
      trigger={
        <Button
          className={className}
          style={style}
          variant="outline"
          intent="danger"
          onClick={(event) => {
            triggerRef.current = event.currentTarget
            setIsOpen((open) => !open)
          }}
        >
          {t("clear.button")}
        </Button>
      }
    >
      <p className={styles.message}>{t("clear.message")}</p>
      <div className={styles.actions}>
        <Button variant="outline" intent="neutral" onClick={close}>
          {t("clear.cancel")}
        </Button>
        <Button variant="filled" intent="danger" onClick={confirm}>
          {t("clear.confirm")}
        </Button>
      </div>
    </Popover>
  )
}
