import { SHARE_PARAM } from "@/constants"
import { isFxMeta } from "@/helpers"
import type { FormValues } from "@/types"

/**
 * O que vai no link. A receita bruta e a exportação ficam de fora: são da
 * empresa de quem compartilha, e o que importa delas já está no imposto.
 */
const SHARED_FIELDS = ["rate", "hours", "fx", "spread", "tax"] as const

export type SharedValues = Pick<FormValues, (typeof SHARED_FIELDS)[number] | "fxMeta">

/** Base64 que aceita qualquer texto — `btoa` sozinho quebra fora do Latin-1 — e cabe numa URL. */
const toBase64Url = (text: string): string => {
  const binary = String.fromCharCode(...new TextEncoder().encode(text))

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

const fromBase64Url = (code: string): string => {
  const binary = atob(code.replace(/-/g, "+").replace(/_/g, "/"))

  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)))
}

export const encodeShareCode = (values: FormValues): string => {
  const shared: SharedValues = {
    rate: values.rate,
    hours: values.hours,
    fx: values.fx,
    spread: values.spread,
    tax: values.tax,
    fxMeta: values.fxMeta,
  }

  return toBase64Url(JSON.stringify(shared))
}

/**
 * O cálculo dentro de um código, ou `null` se o código não for um.
 *
 * O código vem de fora, então cada campo é conferido: só passa texto curto, e
 * a origem da cotação só se for uma que esta versão conhece.
 */
export const decodeShareCode = (code: string): Partial<SharedValues> | null => {
  try {
    const data = JSON.parse(fromBase64Url(code))
    const shared: Partial<SharedValues> = {}

    for (const field of SHARED_FIELDS) {
      const value = data?.[field]

      if (typeof value === "string" && value.length <= 32) {
        shared[field] = value
      }
    }

    if (Object.keys(shared).length === 0) {
      return null
    }

    shared.fxMeta = isFxMeta(data.fxMeta) ? data.fxMeta : null

    return shared
  } catch {
    return null
  }
}

/** O endereço desta página com o cálculo no `?share=`. */
export const buildShareUrl = (values: FormValues): string => {
  const url = new URL(window.location.href)
  url.search = ""
  url.hash = ""
  url.searchParams.set(SHARE_PARAM, encodeShareCode(values))

  return url.toString()
}

/** O cálculo do `?share=` da URL atual, se houver um válido. */
export const readSharedValues = (): Partial<SharedValues> | null => {
  const code = new URLSearchParams(window.location.search).get(SHARE_PARAM)

  return code ? decodeShareCode(code) : null
}

/**
 * Tira o `?share=` da barra de endereço, sem recarregar. Depois de aberto, o
 * cálculo é da pessoa: recarregar não deve trazer o do link de volta por cima
 * do que ela mudou.
 */
export const clearShareParam = () => {
  const url = new URL(window.location.href)

  if (url.searchParams.has(SHARE_PARAM)) {
    url.searchParams.delete(SHARE_PARAM)
    window.history.replaceState(window.history.state, "", url)
  }
}
