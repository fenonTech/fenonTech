import React from "react";
import FinancialCard from "../Cards/FinancialCard";
import { useBalanceVisibility } from "../../hooks/useBalanceVisibility";
import "./MobileFinancialCard.css";

interface NavigationOption {
  key: string;
  label: string;
  title: string;
  value: string;
  icon: string;
  type: "positive" | "negative" | "neutral";
}

interface MobileFinancialCardProps {
  /** Array com as opções de navegação */
  navigationOptions: NavigationOption[];
  /** Card ativo atualmente */
  activeCard: string;
  /** Função para trocar de card */
  onCardSwitch: (cardKey: string) => void;
  /** Classe CSS personalizada */
  className?: string;
}

const MobileFinancialCard: React.FC<MobileFinancialCardProps> = ({
  navigationOptions,
  activeCard,
  onCardSwitch,
  className = "",
}) => {
  const { isBalanceVisible, toggleBalanceVisibility, formatValue } =
    useBalanceVisibility();

  // Encontrar os dados do card ativo
  const activeCardData = navigationOptions.find(
    (option) => option.key === activeCard
  );

  if (!activeCardData) {
    console.warn(`Card ativo "${activeCard}" não encontrado nas opções`);
    return null;
  }

  return (
    <div className={`mobile-financial-card-container ${className}`.trim()}>
      {/* Navegação dos Cards */}
      <div className="mobile-financial-card-navigation">
        {navigationOptions.map((option) => (
          <button
            key={option.key}
            className={`mobile-nav-button ${
              activeCard === option.key ? "active" : ""
            }`}
            onClick={() => onCardSwitch(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Card Único */}
      <div className="mobile-single-financial-card">
        <FinancialCard
          title={activeCardData.title}
          value={formatValue(activeCardData.value)}
          icon={activeCardData.icon}
          type={activeCardData.type}
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
      </div>
    </div>
  );
};

export default MobileFinancialCard;
