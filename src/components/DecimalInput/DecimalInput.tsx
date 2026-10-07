import { Input, type InputProps } from "@jposawa/ronin-ui"

import { maskDecimal, toDecimalText } from "@/helpers"
import { useTranslation } from "@/hooks"

type DecimalInputProps = InputProps & {
  /** Casas decimais fixas: 2 para dinheiro, 4 para cotação. */
  decimals: number
}

/**
 * Um `Input` de valor com máscara de caixa eletrônico — ver `maskDecimal`.
 *
 * O valor de fora é reescrito no formato da máscara a cada render, então o
 * que chegou de outro jeito (gravação antiga, link, troca de idioma) aparece
 * certo sem migração. Colar é a exceção à máscara: "4.98" colado é 4,98, não
 * dígitos soltos.
 */
export const DecimalInput = ({ value, onValueChange, decimals, ...inputProps }: DecimalInputProps) => {
  const { locale } = useTranslation()
  const text = toDecimalText(value, decimals, locale)

  const handleChange = (next: string) => {
    const isPaste = next.length - text.length > 1

    onValueChange(isPaste ? toDecimalText(next, decimals, locale) : maskDecimal(next, decimals, locale))
  }

  return <Input {...inputProps} value={text} onValueChange={handleChange} inputMode="numeric" />
}
