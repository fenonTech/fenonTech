import React, { useState, useEffect } from "react";
import { Dashboard, Receitas, Despesas } from "../views/mobile";
import { ConfiguracoesMobile } from "../views/mobile/Configuracoes";
import { NotificacoesMobile } from "../views/mobile/Notificacoes";
import { PagamentosMobile } from "../views/mobile/Pagamentos";
import { AtualizacaoCadastralMobile } from "../views/mobile/AtualizacaoCadastral";
import { authService } from "../services/authService";
import { APP_URLS } from "../config";
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    // Limpar todos os dados do localStorage
    localStorage.removeItem("fenontech-telefone");
    localStorage.removeItem("fenontech-codigoTemp");
    localStorage.removeItem("fenontech-session-expired");
    localStorage.removeItem("fenontech-subscription-expired");
    localStorage.removeItem("fenontech-userName");

    // Redirecionar para página de login
    window.location.href = APP_URLS.LOGIN;
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
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
            onLogoutClick={handleLogoutClick}
          />
        );
      case "despesas":
        return (
          <Despesas
            onNavigate={handleScreenChange}
            isBalanceVisible={isBalanceVisible}
            onToggleVisibility={handleToggleVisibility}
            userName={userName}
            onLogoutClick={handleLogoutClick}
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
            onLogoutClick={handleLogoutClick}
          />
        );
    }
  };

  return (
    <div className="layout-mobile">
      {renderCurrentScreen()}

      {/* Modal de Confirmação de Logout */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={handleCancelLogout}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar Saída</h3>
            <p>Tem certeza que deseja sair?</p>
            <div className="logout-modal-buttons">
              <button className="cancel-button" onClick={handleCancelLogout}>
                Cancelar
              </button>
              <button className="confirm-button" onClick={handleConfirmLogout}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayoutMobile;
