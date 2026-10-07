/**
 * Os textos em português, e a fonte das chaves: uma chave nova nasce aqui, e o
 * `en.ts` não compila enquanto não tiver a tradução dela.
 *
 * `{nome}` é trocado pelo parâmetro de mesmo nome — ver `translate`.
 */
export const ptBR = {
  "locale.label": "Idioma",

  "home.title": "Do valor/hora em dólar ao líquido em reais",
  "home.intro":
    "Informe o valor/hora e as horas do mês. O cálculo desconta o spread do câmbio e depois o imposto da nota. Os valores ficam salvos neste navegador.",

  "field.rate.label": "Valor/hora em US$",
  "field.rate.placeholder": "45,00",
  "field.hours.label": "Horas no mês",
  "field.spread.label": "Spread em %",
  "field.spread.hint": "Padrão: 0,5%. Vazio conta como 0%.",
  "field.spread.placeholder": "0,5",
  "field.tax.label": "Imposto da nota em %",
  "field.tax.hint": "Padrão: 6%, Simples Nacional, Anexo III, 1ª faixa.",
  "field.tax.afterSpread": "Imposto sobre o valor recebido",
  "field.tax.afterSpreadHint": "Incide sobre o que sobra depois do spread.",
  "field.tax.beforeSpread": "Imposto sobre a cotação cheia",
  "field.tax.beforeSpreadHint": "Incide sobre o valor convertido, antes do spread.",

  "validation.ratePositive": "O valor/hora precisa ser um número maior que zero.",
  "validation.hoursPositive": "As horas precisam ser um número maior que zero.",
  "validation.fxPositive": "A cotação precisa ser um número maior que zero.",
  "validation.percentRange": "Use um percentual entre 0 e 100.",

  "fx.label": "Cotação do dólar em R$",
  "fx.placeholder": "4,9850",
  "fx.sourceHint": "{source}, {date}. Estimativa; a taxa da sua plataforma pode diferir.",
  "fx.manual": "Valor informado manualmente.",
  "fx.source.manual": "Referência manual",
  "fx.source.ptax": "PTAX compra, Banco Central",
  "fx.source.awesome": "Comercial compra, AwesomeAPI",
  "fx.source.frankfurter": "Referência BCE, Frankfurter",
  "fx.provider.label": "Fonte da cotação",
  "fx.provider.auto": "Automática (Banco Central, com reservas)",
  "fx.provider.checked": "{source} · checada em {date}",
  "fx.fetch": "Buscar cotação",
  "fx.fetching": "Buscando…",
  "fx.status.querying": "Consultando: {source}…",
  "fx.status.fallback": "Fonte indisponível. Tentando: {source}…",
  "fx.status.failed": "Não foi possível buscar a cotação agora. Tente outra fonte ou informe o valor manualmente.",

  "simples.title": "Calcular a alíquota do Anexo III",
  "simples.rbt12.label": "Receita bruta dos últimos 12 meses em R$",
  "simples.rbt12.hint": "Usada para definir a faixa e a alíquota efetiva.",
  "simples.rbt12.placeholder": "250000,00",
  "simples.export": "Exportação de serviço (exclui PIS, COFINS e ISS da alíquota)",
  "simples.empty": "Informe a receita bruta para calcular.",
  "simples.invalid": "A receita bruta precisa ser um número.",
  "simples.aboveLimit": "Acima de R$ 1,8 milhão. Informe a alíquota manualmente no campo de imposto.",
  "simples.band": "Faixa {band}.",
  "simples.effective": "Alíquota efetiva:",
  "simples.exportRate": "Sem PIS, COFINS e ISS:",
  "simples.apply": "Usar esta alíquota",
  "simples.note":
    "Considera as faixas 1 a 4 (até R$ 1,8 milhão) e assume que o Fator R mantém você no Anexo III. Confirme com seu contador.",

  "result.title": "Resultado do mês",
  "result.empty": "Preencha valor/hora, horas e cotação para ver o resultado.",
  "result.totalUsd": "Total em USD",
  "result.gross": "Convertido sem spread (× {fx})",
  "result.spread": "Spread ({percent}%)",
  "result.afterSpread": "BRL pós spread",
  "result.tax": "Imposto da nota ({percent}%)",
  "result.taxBeforeSpread": "Imposto da nota ({percent}%, antes do spread)",
  "result.net": "BRL pós imposto",
  "result.perHour": "{amount} por hora, líquido.",
  "result.netShort": "líquido",
  "result.splitDescription": "do valor convertido sem spread",
  "result.part.net": "Líquido",
  "result.part.tax": "Imposto",
  "result.part.spread": "Spread",
  "result.noteBeforeSpread":
    "Percentuais sobre o valor convertido sem spread. O imposto incide sobre esse mesmo valor, antes do spread.",
  "result.note":
    "Percentuais sobre o valor convertido sem spread. O imposto incide sobre o valor já convertido, após o spread.",

  "share.button": "Copiar link",
  "share.copied": "Link copiado. Quem abrir vê este mesmo cálculo.",
  "share.failed": "Não deu para copiar. O link está na barra de endereço.",

  "clear.button": "Apagar dados salvos",
  "clear.title": "Apagar dados salvos?",
  "clear.message": "O que foi salvo neste navegador é apagado e os campos voltam aos valores padrão.",
  "clear.cancel": "Cancelar",
  "clear.confirm": "Apagar",

  "status.restored": "Valores do último uso, salvos em {date}.",
  "status.restoredNoDate": "Valores do último uso restaurados.",
  "status.saved": "Salvo neste navegador em {date}.",
  "status.saveFailed": "Não foi possível salvar neste navegador. Os valores valem só nesta sessão.",
  "status.cleared": "Dados salvos apagados. Valores padrão restaurados.",
  "status.shared":
    "Valores abertos de um link compartilhado. Eles passam a ser salvos neste navegador quando você mudar algum campo.",
}
