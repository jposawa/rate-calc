import { Home } from "@/pages/Home"

// Só a regra global do selo do Netlify; o layout é todo da página.
import "./App.module.css"

/**
 * Uma página só, então nada de roteador. Quando vier a segunda, é aqui que o
 * `react-router-dom` entra — e o `netlify.toml` ganha o fallback de SPA.
 */
export const App = () => <Home />
