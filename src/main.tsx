import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

// Qualquer componente da biblioteca já traz este CSS. O import explícito é
// para os tokens (`--space-*`, `--text-*`, `--border-width`), que os
// `.module.css` daqui usam, não dependerem de a página usar um componente dela.
import "@jposawa/ronin-ui/styles.css"

import { App } from "./App"
// Depois da biblioteca e fora de `@layer`: é o que faz as cores deste projeto
// vencerem os padrões dela.
import "./styles/global.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
