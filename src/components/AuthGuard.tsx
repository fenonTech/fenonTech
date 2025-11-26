import { useEffect, useState } from "react";
import SessionExpired from "../pages/SessionExpired";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const authenticateUser = () => {
      // Capturar parâmetros da URL no formato: /+5511911451180/3r50di
      const pathSegments = window.location.pathname.split("/").filter(Boolean);

      let telefone = null;
      let codigoTemp = null;

      // 🔑 PRIORIDADE 1: Verificar se há novos parâmetros na URL (nova sessão)
      if (pathSegments.length >= 2) {
        telefone = pathSegments[0];
        codigoTemp = pathSegments[1];

        // Validar formato do telefone (deve começar com +)
        if (telefone.startsWith("+") && codigoTemp) {
          console.log("✅ Novos parâmetros capturados da URL:", {
            telefone,
            codigoTemp,
          });

          // Limpar flag de sessão expirada (nova sessão iniciando)
          localStorage.removeItem("fenontech-session-expired");

          // Salvar no localStorage
          localStorage.setItem("fenontech-telefone", telefone);
          localStorage.setItem("fenontech-codigoTemp", codigoTemp);

          // Redirecionar para URL limpa (raiz)
          window.history.replaceState(null, "", "/");
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
      }

      // 🔒 PRIORIDADE 2: Verificar se a sessão expirou (sem novos parâmetros)
      const sessionExpiredFlag = localStorage.getItem(
        "fenontech-session-expired"
      );
      if (sessionExpiredFlag === "true") {
        console.log("🔒 Sessão expirada detectada");
        setSessionExpired(true);
        setIsLoading(false);
        return;
      }

      // Verificar se já existe no localStorage
      const storedTelefone = localStorage.getItem("fenontech-telefone");
      const storedCodigoTemp = localStorage.getItem("fenontech-codigoTemp");

      if (storedTelefone && storedCodigoTemp) {
        console.log("✅ Credenciais encontradas no localStorage");
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // Não tem credenciais válidas - redirecionar para login
      console.log("❌ Credenciais não encontradas - redirecionando para login");
      window.location.href = "https://www.fenontech.com.br/login";
    };

    authenticateUser();
  }, []);

  // 🔒 MOSTRAR PÁGINA DE SESSÃO EXPIRADA
  if (sessionExpired) {
    return <SessionExpired />;
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#666",
        }}
      >
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
