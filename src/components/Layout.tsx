import React, { useState, useEffect } from "react";
import "./Layout.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "../pages/Dashboard/Dashboard";
import Receitas from "../pages/Receitas/Receitas";
import Despesas from "../pages/Despesas/Despesas";
import Configuracoes from "../pages/Configuracoes";
import { APP_URLS } from "../config";
import { authService } from "../services/authService";

const Layout: React.FC = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userName, setUserName] = useState(
    authService.getUserName() || "Usuário"
  );

  // Escutar mudanças no nome do usuário
  useEffect(() => {
    const handleStorageChange = () => {
      setUserName(authService.getUserName() || "Usuário");
    };

    // Escutar eventos de storage do próprio window (quando localStorage muda)
    window.addEventListener("storage", handleStorageChange);

    // Também escutar um evento customizado para mudanças na mesma aba
    window.addEventListener("userNameUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userNameUpdated", handleStorageChange);
    };
  }, []);

  const handleItemClick = (item: string) => {
    setActiveItem(item);

    // Simular ações dos menu items
    switch (item) {
      case "sair":
        if (window.confirm("Deseja realmente sair?")) {
          console.log("Usuário saiu");
        }
        break;
      case "configuracao":
        console.log("Abrir configurações");
        break;
      default:
        console.log(`Navegar para: ${item}`);
    }
  };

  const handleConfigClick = () => {
    setActiveItem("configuracao");
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

  const getPageInfo = () => {
    switch (activeItem) {
      case "dashboard":
        return {
          title: "DashBoard Financeiro",
          description: "Bem-vindo ao seu controle financeiro inteligente",
        };
      case "receitas":
        return {
          title: "Receitas",
          description: "Gerencie suas fontes de renda e ganhos",
        };
      case "despesas":
        return {
          title: "Despesas",
          description: "Controle seus gastos e despesas mensais",
        };
      case "configuracao":
        return {
          title: "Configurações",
          description:
            "Personalize suas preferências e configurações do sistema",
        };
      default:
        return {
          title: "DashBoard Financeiro",
          description: "Bem-vindo ao seu controle financeiro inteligente",
        };
    }
  };

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveItem} />;
      case "receitas":
        return <Receitas />;
      case "despesas":
        return <Despesas />;
      case "configuracao":
        return <Configuracoes />;
      default:
        return <Dashboard onNavigate={setActiveItem} />;
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="layout">
      <Sidebar
        activeItem={activeItem}
        onItemClick={handleItemClick}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
      />
      <div
        className={`main-content ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <Header
          userName={userName}
          pageTitle={pageInfo.title}
          pageDescription={pageInfo.description}
          onConfigClick={handleConfigClick}
          onLogoutClick={handleLogoutClick}
        />
        <main className="content">{renderContent()}</main>
      </div>

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

export default Layout;
