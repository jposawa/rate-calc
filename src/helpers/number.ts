/**
 * Lê um número escrito à brasileira ou à americana.
 *
 * Aceita "1.234,56", "1234,56", "1,234.56" e "1234.56", com ou sem "R$",
 * "US$" e "%". Quando aparecem os dois separadores, o último é o decimal.
 * Devolve `NaN` para o que não for número — quem chama decide o que é erro.
 */
export const parseNumber = (raw: string): number => {
  let text = raw.replace(/\s|R\$|US\$|%/g, "")

  if (!text) {
    return NaN
  }

  const hasComma = text.includes(",")
  const hasDot = text.includes(".")

  if (hasComma && hasDot) {
    text = text.lastIndexOf(",") > text.lastIndexOf(".")
      ? text.replace(/\./g, "").replace(",", ".")
      : text.replace(/,/g, "")
  } else if (hasComma) {
    // Duas vírgulas ou mais só fazem sentido como separador de milhar.
    text = text.split(",").length > 2 ? text.replace(/,/g, "") : text.replace(",", ".")
  } else if (hasDot && (text.match(/\./g) ?? []).length > 1) {
    text = text.replace(/\./g, "")
  }

  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(text)) {
    return NaN
  }

  return Number(text)
}

/**
 * Como `parseNumber`, mas "250.000" e "250,000" são milhar e não decimal.
 *
 * Para valores em reais grandes, como a receita bruta, ninguém escreve
 * "250.000" — nem, em inglês, "250,000" — querendo dizer duzentos e cinquenta.
 */
export const parseAmount = (raw: string): number => {
  const text = raw.trim()

  if (/^\d{1,3}([.,]\d{3})+$/.test(text) && !(text.includes(".") && text.includes(","))) {
    return Number(text.replace(/[.,]/g, ""))
  }

  return parseNumber(text)
}
