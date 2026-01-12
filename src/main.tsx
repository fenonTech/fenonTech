import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// 🔧 DEV MODE: Preencher localStorage automaticamente em desenvolvimento
if (import.meta.env.DEV) {
  const devToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidGVsZWZvbmUiOiIrNTUxMTkxMTQ1MTE4MCIsIm5vbWUiOiJHdXN0YXZvIiwiaWF0IjoxNzY4MTk4NzgzLCJleHAiOjE3Njg4MDM1ODN9.VUbPvtKFT5ie6_fhs-x9HyASfHEHfLtCeSSZaF88EzI";
  const devUserName = "Gustavo";

  localStorage.setItem("fenontech-token", devToken);
  localStorage.setItem("fenontech-user-name", devUserName);

  console.log("🔓 DEV MODE: Token e usuário configurados automaticamente");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
