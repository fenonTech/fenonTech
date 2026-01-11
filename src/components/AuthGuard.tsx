import { useEffect, useState } from "react";
import SubscriptionModal from "./SubscriptionModal";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se está em ambiente de desenvolvimento
  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    const authenticateUser = () => {
      // 🚀 MODO DESENVOLVIMENTO: Pular autenticação
      // isDevelopment = true;
      // if (isDevelopment) {
      console.log("🔓 Modo DEV: Autenticação desabilitada");
      // Limpar flags de desenvolvimento
      localStorage.removeItem("fenontech-session-expired");
      localStorage.removeItem("fenontech-subscription-expired");
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
      // }

      // // Capturar parâmetros como query string: ?telefone=+5511911451180&codigo=x76elj
      // const urlParams = new URLSearchParams(window.location.search);
      // const telefoneParam = urlParams.get("telefone");
      // const codigoParam = urlParams.get("codigo");

      // // 🔑 PRIORIDADE 1: Verificar se há novos parâmetros na URL (nova sessão)
      // if (telefoneParam && codigoParam) {
      //   // Validar formato do telefone (deve começar com +)
      //   if (telefoneParam.startsWith("+")) {
      //     console.log("✅ Novos parâmetros capturados da URL:", {
      //       telefone: telefoneParam,
      //       codigoTemp: codigoParam,
      //     });

      //     // Limpar flags de sessão e assinatura expiradas (nova sessão iniciando)
      //     localStorage.removeItem("fenontech-session-expired");
      //     localStorage.removeItem("fenontech-subscription-expired");

      //     // Salvar no localStorage
      //     localStorage.setItem("fenontech-telefone", telefoneParam);
      //     localStorage.setItem("fenontech-codigoTemp", codigoParam);

      //     // Redirecionar para URL limpa (sem query params)
      //     window.history.replaceState({}, "", window.location.pathname);
      //     setIsAuthenticated(true);
      //     setIsLoading(false);
      //     return;
      //   }
      // }

      // // 🔒 PRIORIDADE 2: Verificar se a assinatura expirou (erro 403)
      // const subscriptionExpiredFlag = localStorage.getItem(
      //   "fenontech-subscription-expired"
      // );
      // if (subscriptionExpiredFlag === "true") {
      //   console.log("💳 Assinatura expirada detectada - mostrando modal");
      //   // Não seta subscriptionExpired aqui, apenas permite login normal
      //   // O modal será mostrado depois
      // }

      // // 🔒 PRIORIDADE 3: Verificar se a sessão expirou (erro 401)
      // const sessionExpiredFlag = localStorage.getItem(
      //   "fenontech-session-expired"
      // );
      // if (sessionExpiredFlag === "true") {
      //   console.log("🔒 Sessão expirada detectada");
      //   setSessionExpired(true);
      //   setIsLoading(false);
      //   return;
      // }

      // // Verificar se já existe no localStorage
      // const storedTelefone = localStorage.getItem("fenontech-telefone");
      // const storedCodigoTemp = localStorage.getItem("fenontech-codigoTemp");

      // if (storedTelefone && storedCodigoTemp) {
      //   console.log("✅ Credenciais encontradas no localStorage");
      //   setIsAuthenticated(true);
      //   setIsLoading(false);
      //   return;
      // }

      // // Não tem credenciais válidas - redirecionar para login
      // console.log("❌ Credenciais não encontradas - redirecionando para login");
      // window.location.href = APP_URLS.LOGIN;
    };

    authenticateUser();
  }, []);

  // Não redireciona para página de assinatura - usa modal overlay


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

  // ✅ USUÁRIO AUTENTICADO - Verificar se deve mostrar modal de assinatura
  const showSubscriptionModal =
    !isDevelopment && // Não mostrar em desenvolvimento
    localStorage.getItem("fenontech-subscription-expired") === "true";

  return (
    <>
      {children}
      <SubscriptionModal isOpen={showSubscriptionModal} />
    </>
  );
};

export default AuthGuard;
