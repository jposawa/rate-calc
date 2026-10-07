import { Button, Popover, type BaseComponent } from "@jposawa/ronin-ui"
import clsx from "clsx"
import { useRef, useState } from "react"

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
 * dentro dele, e sem isto o foco cairia no `body`.
 */
export const ClearDataButton = ({ onConfirm, className, style }: ClearDataButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const close = () => {
    setIsOpen(false)
    // O primeiro botão do wrapper é o gatilho; o painel vem depois dele.
    wrapperRef.current?.querySelector("button")?.focus()
  }

  const confirm = () => {
    onConfirm()
    close()
  }

  return (
    <div ref={wrapperRef} className={clsx(styles.wrapper, className)} style={style}>
      <Popover
        title="Apagar dados salvos?"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="top-start"
        trigger={
          <Button variant="outline" intent="danger" onClick={() => setIsOpen((open) => !open)}>
            Apagar dados salvos
          </Button>
        }
      >
        <p className={styles.message}>
          O que foi salvo neste navegador é apagado e os campos voltam aos valores padrão.
        </p>
        <div className={styles.actions}>
          <Button variant="outline" intent="neutral" onClick={close}>
            Cancelar
          </Button>
          <Button variant="filled" intent="danger" onClick={confirm}>
            Apagar
          </Button>
        </div>
      </Popover>
    </div>
  )
}
