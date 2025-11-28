import React, { useState, useEffect } from "react";
import "./Layout.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import Dashboard from "../pages/Dashboard";
import Receitas from "../pages/Receitas";
import Despesas from "../pages/Despesas";
import Planejamento from "../pages/Planejamento";
import Configuracoes from "../pages/Configuracoes";

const Layout: React.FC = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Inicializar como fechado no mobile
    return window.innerWidth <= 600;
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  // Funções específicas para o dropdown do header mobile
  const handleConfigClick = () => {
    setActiveItem("configuracao");
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    // Limpar localStorage
    localStorage.removeItem("fenontech-telefone");
    localStorage.removeItem("fenontech-codigoTemp");
    localStorage.removeItem("fenontech-session-expired");
    localStorage.removeItem("fenontech-userName");

    // Redirecionar para página de login
    window.location.href =
      "https://www.fenontech.com.br/landingpage/index.html#/login";
  };
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Gerenciar estado do sidebar baseado no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 600;
      if (isMobile) {
        setSidebarCollapsed(true); // Sempre fechado no mobile inicialmente
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      case "planejamento":
        return {
          title: "Planejamento",
          description: "Planeje suas receitas e despesas mensais",
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
        return <Dashboard />;
      case "receitas":
        return <Receitas />;
      case "despesas":
        return <Despesas />;
      case "planejamento":
        return <Planejamento />;
      case "configuracao":
        return <Configuracoes />;
      default:
        return <Dashboard />;
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
          userName={localStorage.getItem("fenontech-userName") || "Usuário"}
          pageTitle={pageInfo.title}
          pageDescription={pageInfo.description}
          onConfigClick={handleConfigClick}
          onLogoutClick={handleLogoutClick}
        />
        <main className="content">{renderContent()}</main>
      </div>
      <BottomNavigation activeTab={activeItem} onTabChange={handleItemClick} />

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
