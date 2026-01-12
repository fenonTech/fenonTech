import { useEffect, useState } from "react";
import SubscriptionModal from "./SubscriptionModal";
import { authService } from "../services/authService";
import { APP_URLS } from "../config/urls.config";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Verificar se está em ambiente de desenvolvimento
  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    const authenticateUser = async () => {
      // 🚀 MODO DESENVOLVIMENTO: Pular autenticação
      if (isDevelopment) {
        console.log("🔓 Modo DEV: Autenticação desabilitada");
        // Limpar flags de desenvolvimento
        localStorage.removeItem("fenontech-session-expired");
        localStorage.removeItem("fenontech-subscription-expired");
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

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
            codigo: codigoParam,
          });

          try {
            // Chamar API de login
            const response = await authService.login(
              telefoneParam,
              codigoParam
            );

            if (response.status && response.status_code === 200) {
              // Login bem-sucedido
              console.log("✅ Login realizado com sucesso");

              // Limpar flags de sessão e assinatura expiradas
              localStorage.removeItem("fenontech-session-expired");
              localStorage.removeItem("fenontech-subscription-expired");

              // Verificar status da assinatura
              if (response.assinatura && !response.assinatura.ativa) {
                localStorage.setItem("fenontech-subscription-expired", "true");
              }

              // Redirecionar para URL limpa (sem query params)
              window.history.replaceState({}, "", window.location.pathname);
              setIsAuthenticated(true);
              setIsLoading(false);
              return;
            } else {
              // Login falhou (código inválido ou expirado)
              console.error("❌ Erro de login:", response.message);
              setLoginError(response.message || "Código inválido ou expirado");
              setIsLoading(false);

              // Redirecionar para página de login após 3 segundos
              setTimeout(() => {
                window.location.href = APP_URLS.LOGIN;
              }, 3000);
              return;
            }
          } catch (error) {
            console.error("❌ Erro ao fazer login:", error);
            setLoginError("Erro ao fazer login. Tente novamente.");
            setIsLoading(false);

            // Redirecionar para página de login após 3 segundos
            setTimeout(() => {
              window.location.href = APP_URLS.LOGIN;
            }, 3000);
            return;
          }
        }
      }

      // 🔒 PRIORIDADE 2: Verificar se já existe token válido
      if (authService.isAuthenticated()) {
        console.log("✅ Token encontrado no localStorage");

        // Verificar se a assinatura está expirada
        const subscription = authService.getSubscription();
        if (subscription && !subscription.ativa) {
          localStorage.setItem("fenontech-subscription-expired", "true");
        }

        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // 🔒 PRIORIDADE 3: Verificar se a sessão expirou (erro 401)
      const sessionExpiredFlag = localStorage.getItem(
        "fenontech-session-expired"
      );
      if (sessionExpiredFlag === "true") {
        console.log("🔒 Sessão expirada detectada");
        setIsLoading(false);
        // Redirecionar para login
        window.location.href = APP_URLS.LOGIN;
        return;
      }

      // Não tem credenciais válidas - redirecionar para login
      console.log("❌ Credenciais não encontradas - redirecionando para login");
      window.location.href = APP_URLS.LOGIN;
    };

    authenticateUser();
  }, [isDevelopment]);

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

  // Mostrar erro de login se houver
  if (loginError) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#d32f2f",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <p style={{ marginBottom: "10px" }}>❌ {loginError}</p>
        <p style={{ fontSize: "14px", color: "#666" }}>
          Redirecionando para a página de login...
        </p>
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
