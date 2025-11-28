import { useEffect, useState } from "react";
import SessionExpired from "../pages/SessionExpired";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const authenticateUser = () => {
      // Capturar parâmetros como query string: ?telefone=+5511911451180&codigo=x76elj
      const urlParams = new URLSearchParams(window.location.search);
      const telefoneParam = urlParams.get("telefone");
      const codigoParam = urlParams.get("codigo");

      // 🔑 PRIORIDADE 1: Verificar se há novos parâmetros na URL (nova sessão)
      if (telefoneParam && codigoParam) {
        // Validar formato do telefone (deve começar com +)
        if (telefoneParam.startsWith("+")) {
          console.log("✅ Novos parâmetros capturados da URL:", {
            telefone: telefoneParam,
            codigoTemp: codigoParam,
          });

          // Limpar flag de sessão expirada (nova sessão iniciando)
          localStorage.removeItem("fenontech-session-expired");

          // Salvar no localStorage
          localStorage.setItem("fenontech-telefone", telefoneParam);
          localStorage.setItem("fenontech-codigoTemp", codigoParam);

          // Redirecionar para URL limpa (sem query params)
          window.history.replaceState({}, "", window.location.pathname);
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
      window.location.href =
        "https://www.fenontech.com.br/landingpage/index.html#/login";
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
