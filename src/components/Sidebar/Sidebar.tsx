import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import logo from "../../assets/logo.png";
import simboloReceita from "../../assets/simboloMenuReceita.png";
import simboloDespesas from "../../assets/simboloMenuDespesas.png";
import simboloConfiguracao from "../../assets/simboloConfiguracao.png";
import simboloSaida from "../../assets/simboloSaida.png";
import simboloMenuBurguer from "../../assets/simboloMenuBurguer.png";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  onItemClick,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse,
}) => {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isCollapsed =
    externalIsCollapsed !== undefined
      ? externalIsCollapsed
      : internalIsCollapsed;

  // Toggle function
  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    if (onToggleCollapse) {
      onToggleCollapse(newCollapsedState);
    } else {
      setInternalIsCollapsed(newCollapsedState);
    }
  };

  // Detectar se está em mobile e inicializar como fechado
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 600;
      setIsMobile(mobile);
      if (mobile && externalIsCollapsed === undefined) {
        setInternalIsCollapsed(true); // Inicia fechado no mobile apenas se não for controlado
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [externalIsCollapsed]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard-svg" },
    { id: "receitas", label: "Receitas", icon: simboloReceita },
    { id: "despesas", label: "Despesas", icon: simboloDespesas },
  ];

  const systemItems = [
    { id: "configuracao", label: "Configurações", icon: simboloConfiguracao },
    { id: "sair", label: "Sair", icon: simboloSaida },
  ];

  const renderIcon = (item: { id: string; icon: string; label: string }) => {
    if (item.id === "dashboard") {
      return (
        <svg
          className="nav-icon dashboard-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
            fill="white"
          />
        </svg>
      );
    }
    return <img src={item.icon} alt={item.label} className="nav-icon" />;
  };

  return (
    <div
      className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
        isMobile ? "mobile" : ""
      }`}
    >
      <div className="sidebar-header">
        {(!isCollapsed || !isMobile) && (
          <img src={logo} alt="Meu Bolso" className="logo" />
        )}
        {!isCollapsed && <span className="app-name">Meu Bolso</span>}
        <button className="menu-toggle" onClick={toggleCollapse}>
          <img src={simboloMenuBurguer} alt="Menu" />
        </button>
      </div>

      <nav className="sidebar-nav">
        {/* Esconder navegação completamente quando fechado no mobile */}
        {!(isMobile && isCollapsed) && (
          <>
            <div className="nav-section">
              {!isCollapsed && <span className="nav-title">Navegação</span>}
              <ul className="nav-list">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      className={`nav-item ${
                        activeItem === item.id ? "active" : ""
                      }`}
                      onClick={() => onItemClick(item.id)}
                    >
                      {renderIcon(item)}
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav-section">
              {!isCollapsed && <span className="nav-title">Sistema</span>}
              <ul className="nav-list">
                {systemItems.map((item) => (
                  <li key={item.id}>
                    <button
                      className={`nav-item ${
                        activeItem === item.id ? "active" : ""
                      }`}
                      onClick={() => onItemClick(item.id)}
                    >
                      {renderIcon(item)}
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
