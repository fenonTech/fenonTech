import React, { useState } from "react";
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
        />
        <main className="content">{renderContent()}</main>
      </div>
      <BottomNavigation activeTab={activeItem} onTabChange={handleItemClick} />
    </div>
  );
};

export default Layout;
