import React, { useState, useEffect } from "react";
import "./Layout.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import Dashboard from "../pages/Dashboard";
import Receitas from "../pages/Receitas";
import Despesas from "../pages/Despesas";
import Configuracoes from "../pages/Configuracoes";

const Layout: React.FC = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Inicializar como fechado no mobile
    return window.innerWidth <= 600;
  });

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
    if (window.confirm("Deseja realmente sair?")) {
      console.log("Usuário saiu da aplicação");
      // Aqui você pode adicionar a lógica de logout real
    }
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
          userName="Gustavo Nascimento"
          pageTitle={pageInfo.title}
          pageDescription={pageInfo.description}
          onConfigClick={handleConfigClick}
          onLogoutClick={handleLogoutClick}
        />
        <main className="content">{renderContent()}</main>
      </div>
      <BottomNavigation activeTab={activeItem} onTabChange={handleItemClick} />
    </div>
  );
};

export default Layout;
