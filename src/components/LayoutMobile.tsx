import React, { useState } from "react";
import { Dashboard, Receitas, Despesas } from "../views/mobile";
import { ConfiguracoesMobile } from "../views/mobile/Configuracoes";
import { NotificacoesMobile } from "../views/mobile/Notificacoes";
import { PagamentosMobile } from "../views/mobile/Pagamentos";
import { AtualizacaoCadastralMobile } from "../views/mobile/AtualizacaoCadastral";
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
          />
        );
      case "despesas":
        return (
          <Despesas
            onNavigate={handleScreenChange}
            isBalanceVisible={isBalanceVisible}
            onToggleVisibility={handleToggleVisibility}
          />
        );
      case "configuracoes":
        return (
          <ConfiguracoesMobile
            userName="Gustavo Gomes do Nascimento"
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
            userName="Gustavo Gomes do Nascimento"
          />
        );
      case "inicio":
      default:
        return (
          <Dashboard
            onNavigate={handleScreenChange}
            isBalanceVisible={isBalanceVisible}
            onToggleVisibility={handleToggleVisibility}
          />
        );
    }
  };

  return <div className="layout-mobile">{renderCurrentScreen()}</div>;
};

export default LayoutMobile;
