import React, { useState, useEffect } from "react";
import { Dashboard, Receitas, Despesas } from "../views/mobile";
import { ConfiguracoesMobile } from "../views/mobile/Configuracoes";
import { NotificacoesMobile } from "../views/mobile/Notificacoes";
import { PagamentosMobile } from "../views/mobile/Pagamentos";
import { AtualizacaoCadastralMobile } from "../views/mobile/AtualizacaoCadastral";
import { authService } from "../services/authService";
import "./LayoutMobile.css";

export type MobileScreenType =
  | "inicio"
  | "receitas"
  | "despesas"
  | "configuracoes"
  | "notificacoes"
  | "pagamentos"
  | "atualizacao";

const LayoutMobile: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<MobileScreenType>("inicio");
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [userName, setUserName] = useState(
    authService.getUserName() || "Usuário"
  );

  // Escutar mudanças no nome do usuário
  useEffect(() => {
    const handleUserNameUpdate = () => {
      setUserName(authService.getUserName() || "Usuário");
    };

    window.addEventListener("userNameUpdated", handleUserNameUpdate);

    return () => {
      window.removeEventListener("userNameUpdated", handleUserNameUpdate);
    };
  }, []);

  const handleScreenChange = (screen: MobileScreenType) => {
    setActiveScreen(screen);
  };

  const handleToggleVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const renderCurrentScreen = () => {
    switch (activeScreen) {
      case "receitas":
        return (
          <Receitas
            onNavigate={handleScreenChange}
            isBalanceVisible={isBalanceVisible}
            onToggleVisibility={handleToggleVisibility}
            userName={userName}
          />
        );
      case "despesas":
        return (
          <Despesas
            onNavigate={handleScreenChange}
            isBalanceVisible={isBalanceVisible}
            onToggleVisibility={handleToggleVisibility}
            userName={userName}
          />
        );
      case "configuracoes":
        return (
          <ConfiguracoesMobile
            userName={userName}
            onBack={() => handleScreenChange("inicio")}
            onNavigate={(screen) => {
              if (screen === "notificacoes") {
                handleScreenChange("notificacoes");
              } else if (screen === "pagamentos") {
                handleScreenChange("pagamentos");
              } else if (screen === "atualizacao") {
                handleScreenChange("atualizacao");
              }
            }}
          />
        );
      case "notificacoes":
        return (
          <NotificacoesMobile
            onBack={() => handleScreenChange("configuracoes")}
          />
        );
      case "pagamentos":
        return (
          <PagamentosMobile
            onBack={() => handleScreenChange("configuracoes")}
          />
        );
      case "atualizacao":
        return (
          <AtualizacaoCadastralMobile
            onBack={() => handleScreenChange("configuracoes")}
          />
        );
      case "inicio":
      default:
        return (
          <Dashboard
            onNavigate={handleScreenChange}
            isBalanceVisible={isBalanceVisible}
            onToggleVisibility={handleToggleVisibility}
            userName={userName}
          />
        );
    }
  };

  return <div className="layout-mobile">{renderCurrentScreen()}</div>;
};

export default LayoutMobile;
