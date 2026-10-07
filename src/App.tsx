import { Home } from "@/pages/Home"

import styles from "./App.module.css"

/**
 * Uma página só, então nada de roteador. Quando vier a segunda, é aqui que o
 * `react-router-dom` entra — e o `netlify.toml` ganha o fallback de SPA.
 */
export const App = () => (
  <div className={styles.shell}>
    <Home />
  </div>
)
