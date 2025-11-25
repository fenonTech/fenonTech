import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Limpar localStorage antigo ao iniciar a aplicação
// Agora usamos apenas API como fonte de dados
localStorage.removeItem("fenontech-transactions");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
