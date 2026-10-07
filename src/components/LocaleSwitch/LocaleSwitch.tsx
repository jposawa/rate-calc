import { Button, type BaseComponent } from "@jposawa/ronin-ui"
import clsx from "clsx"

import { useTranslation } from "@/hooks"
import type { Locale } from "@/types"

import styles from "./LocaleSwitch.module.css"

/** Cada idioma com o nome escrito nele mesmo — quem não lê o atual ainda acha o seu. */
const OPTIONS: { locale: Locale; short: string; name: string }[] = [
  { locale: "pt-BR", short: "PT", name: "Português" },
  { locale: "en", short: "EN", name: "English" },
]

/** PT | EN. O idioma atual fica marcado com `aria-pressed`. */
export const LocaleSwitch = ({ className, style }: BaseComponent) => {
  const { locale, setLocale, t } = useTranslation()

  return (
    <div className={clsx(styles.switch, className)} style={style} role="group" aria-label={t("locale.label")}>
      {OPTIONS.map((option) => (
        <Button
          key={option.locale}
          className={styles.option}
          variant="text"
          intent="neutral"
          lang={option.locale}
          title={option.name}
          aria-pressed={option.locale === locale}
          onClick={() => setLocale(option.locale)}
        >
          {option.short}
        </Button>
      ))}
    </div>
  )
}
