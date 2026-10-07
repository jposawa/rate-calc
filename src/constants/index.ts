import type { FormValues, FxSource, Locale, SimplesBand } from "@/types"

export const STORAGE_KEY = "rate-calc:v1"

export const LOCALE_KEY = "rate-calc:locale"

/** O parâmetro da URL que leva um cálculo compartilhado: `?share=<código>`. */
export const SHARE_PARAM = "share"

export const FX_SOURCES: FxSource[] = ["manual", "ptax", "awesome", "frankfurter"]

/** Espera entre a última tecla e a gravação, para não escrever a cada caractere. */
export const SAVE_DELAY_MS = 400

/** Cada fonte de cotação tem esse tempo antes de passar para a próxima. */
export const FX_TIMEOUT_MS = 7000

const BASE_VALUES: FormValues = {
  rate: "",
  hours: "160",
  fx: "5,00",
  spread: "0,5",
  tax: "6",
  rbt12: "",
  isExport: false,
  fxMeta: { source: "manual", date: "2026-10-07" },
}

/** Os mesmos padrões, com o separador decimal de cada idioma. */
export const DEFAULT_VALUES: Record<Locale, FormValues> = {
  "pt-BR": BASE_VALUES,
  en: { ...BASE_VALUES, fx: "5.00", spread: "0.5" },
}

/**
 * Simples Nacional, Anexo III (LC 123/2006), faixas 1 a 4 — até R$ 1,8 milhão.
 * Acima disso a pessoa informa a alíquota à mão.
 */
export const ANEXO_III: SimplesBand[] = [
  { max: 180_000, rate: 0.06, deduction: 0, share: { cofins: 0.1282, pis: 0.0278, iss: 0.335 } },
  { max: 360_000, rate: 0.112, deduction: 9_360, share: { cofins: 0.1405, pis: 0.0305, iss: 0.32 } },
  { max: 720_000, rate: 0.135, deduction: 17_640, share: { cofins: 0.1364, pis: 0.0296, iss: 0.325 } },
  { max: 1_800_000, rate: 0.16, deduction: 35_640, share: { cofins: 0.1364, pis: 0.0296, iss: 0.325 } },
]
