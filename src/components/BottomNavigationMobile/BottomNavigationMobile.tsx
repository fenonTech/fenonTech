import React from "react";
import "./BottomNavigationMobile.css";
import homeIcon from "/src/assets/home.png";
import receitaIcon from "/src/assets/receita.png";
import despesaIcon from "/src/assets/despesa.png";

interface BottomNavigationMobileProps {
  activeTab: "inicio" | "receitas" | "despesas";
  onTabChange: (tab: "inicio" | "receitas" | "despesas") => void;
}

const BottomNavigationMobile: React.FC<BottomNavigationMobileProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="bottom-navigation-mobile">
      <button
        className={`bottom-nav-item ${activeTab === "inicio" ? "active" : ""}`}
        onClick={() => onTabChange("inicio")}
      >
        <img src={homeIcon} alt="Início" className="bottom-nav-icon" />
        <span className="bottom-nav-label">Início</span>
      </button>

      <button
        className={`bottom-nav-item ${
          activeTab === "receitas" ? "active" : ""
        }`}
        onClick={() => onTabChange("receitas")}
      >
        <img src={receitaIcon} alt="Receitas" className="bottom-nav-icon" />
        <span className="bottom-nav-label">Receitas</span>
      </button>

      <button
        className={`bottom-nav-item ${
          activeTab === "despesas" ? "active" : ""
        }`}
        onClick={() => onTabChange("despesas")}
      >
        <img src={despesaIcon} alt="Despesas" className="bottom-nav-icon" />
        <span className="bottom-nav-label">Despesas</span>
      </button>
    </div>
  );
};

export default BottomNavigationMobile;
