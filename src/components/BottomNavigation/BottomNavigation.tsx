import React from "react";
import "./BottomNavigation.css";
import simboloDashboard from "../../assets/simboloDashboardAmarelo.png";
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
    simboloDashboard,
    simboloReceita,
    simboloDespesas,
    simboloConfiguracao,
  });

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: simboloDashboard,
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
    {
      id: "configuracao",
      label: "Config",
      icon: simboloConfiguracao,
      path: "/configuracoes",
    },
  ];

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
            <img
              src={item.icon}
              alt={item.label}
              className="bottom-nav-icon"
              onError={() =>
                console.error("Erro ao carregar imagem:", item.label, item.icon)
              }
              onLoad={() =>
                console.log("Imagem carregada com sucesso:", item.label)
              }
            />
            <span className="bottom-nav-label">{item.label}</span>
            {activeTab === item.id && <div className="bottom-nav-indicator" />}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
