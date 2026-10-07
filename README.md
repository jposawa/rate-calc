# Rate Calc

Do valor/hora em dólar ao líquido em reais: total do mês em USD, conversão pela
cotação, desconto do spread e do imposto da nota. Inclui uma calculadora da
alíquota do Simples Nacional (Anexo III) e busca a cotação de compra do dólar
na fonte escolhida: PTAX do Banco Central, AwesomeAPI, Frankfurter, ou a
automática, que tenta nessa ordem. Cada fonte mostra quando respondeu pela
última vez neste navegador.

Os valores ficam salvos no `localStorage` do navegador. "Copiar link" gera uma
URL com o cálculo em `?share=<código>` (JSON em base64url) — quem abre vê os
mesmos valores, sem perder o que tinha salvo. A receita bruta não vai no link.

Em português e inglês, com seletor no topo. Valor/hora, cotação e receita bruta
usam máscara de casas decimais fixas (digita-se só os dígitos).

Versão React do `conversor-usd-brl.html`, com os componentes da
[`@jposawa/ronin-ui`](https://www.npmjs.com/package/@jposawa/ronin-ui).

## Rodando

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # typecheck + build em dist/
pnpm lint
```

Node 22 ou mais novo (exigência da ronin-ui).

## Estrutura

```
src/
  pages/        uma pasta por página — hoje só Home
  components/   componentes deste projeto, um por pasta (.tsx + .module.css + index.ts)
  hooks/        useStoredValues (formulário lembrado no navegador) e useTranslation
  i18n/         textos em pt-BR e en, chave → texto, e o provider do idioma
  services/     o que sai do app: APIs de cotação, localStorage e link compartilhado
  helpers/      funções puras: parse e máscara de número, cálculo, Anexo III, formatação
  constants/    padrões do formulário e tabela do Anexo III
  types/        tipos compartilhados
  styles/       global.css — valores dos tokens (claro e escuro), base do body e reset de margem
```

O estilo é CSS Modules; o único CSS global é `styles/global.css`. Componentes
da ronin-ui são importados direto da biblioteca, não reexportados por
`@/components`.

### Traduções

Um texto novo nasce em `src/i18n/messages/ptBR.ts`, que define as chaves; o
`en.ts` não compila enquanto não tiver a tradução. No componente:

```tsx
const { t, fmt } = useTranslation()

t("result.perHour", { amount: fmt.brl(value) }) // "{amount} por hora, líquido."
```

`fmt` formata número e data no idioma atual.

## Deploy

Netlify, configurado em `netlify.toml` (`pnpm build`, publica `dist/`). O selo
do Netlify é escondido em `src/App.module.css`.
