import React from "react";
import "./BottomNavigation.css";
import simboloReceita from "../../assets/simboloMenuReceita.png";
import simboloDespesas from "../../assets/simboloMenuDespesas.png";
import simboloConfiguracao from "../../assets/simboloConfiguracao.png";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  // Debug: verificar se as imagens estão sendo importadas
  console.log("BottomNavigation - Ícones carregados:", {
    simboloReceita,
    simboloDespesas,
    simboloConfiguracao,
  });

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "dashboard-svg",
      path: "/",
    },
    {
      id: "receitas",
      label: "Receitas",
      icon: simboloReceita,
      path: "/receitas",
    },
    {
      id: "despesas",
      label: "Despesas",
      icon: simboloDespesas,
      path: "/despesas",
    },
    // Configuração removida do mobile - agora fica no dropdown do header
  ];

  const renderIcon = (item: {
    id: string;
    icon: string | any;
    label: string;
  }) => {
    if (item.id === "dashboard") {
      return (
        <svg
          className="bottom-nav-icon dashboard-icon"
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
    if (item.id === "planejamento") {
      return (
        <svg
          className="bottom-nav-icon planejamento-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
            fill="white"
          />
        </svg>
      );
    }
    return (
      <img
        src={item.icon}
        alt={item.label}
        className="bottom-nav-icon"
        onError={() =>
          console.error("Erro ao carregar imagem:", item.label, item.icon)
        }
        onLoad={() => console.log("Imagem carregada com sucesso:", item.label)}
      />
    );
  };

  console.log("BottomNavigation renderizando com activeTab:", activeTab);

  return (
    <nav className="bottom-navigation">
      <div className="bottom-nav-container">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`bottom-nav-item ${
              activeTab === item.id ? "active" : ""
            }`}
            onClick={() => onTabChange(item.id)}
            aria-label={item.label}
          >
            {renderIcon(item)}
            <span className="bottom-nav-label">{item.label}</span>
            {activeTab === item.id && <div className="bottom-nav-indicator" />}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
