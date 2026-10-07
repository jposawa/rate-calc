# Rate Calc

Do valor/hora em dólar ao líquido em reais: total do mês em USD, conversão pela
cotação, desconto do spread e do imposto da nota. Inclui uma calculadora da
alíquota do Simples Nacional (Anexo III) e busca a cotação de compra do dólar
(PTAX do Banco Central, com AwesomeAPI e Frankfurter de reserva).

Os valores ficam salvos no `localStorage` do navegador.

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
  hooks/        useStoredValues — o formulário lembrado no navegador
  services/     o que sai do app: APIs de cotação e localStorage
  helpers/      funções puras: parse de número, cálculo, Anexo III, formatação
  constants/    padrões do formulário e tabela do Anexo III
  types/        tipos compartilhados
  styles/       global.css — valores dos tokens (claro e escuro) e base do body
```

O estilo é CSS Modules; o único CSS global é `styles/global.css`. Componentes
da ronin-ui são importados direto da biblioteca, não reexportados por
`@/components`.

## Deploy

Netlify, configurado em `netlify.toml` (`pnpm build`, publica `dist/`). O selo
do Netlify é escondido em `src/App.module.css`.
