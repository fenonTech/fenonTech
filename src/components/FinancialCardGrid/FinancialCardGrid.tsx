import React from "react";
import "./FinancialCardGrid.css";
import { UnifiedFinancialCard } from "../Cards";

export interface FinancialCardData {
  title: string;
  value: string;
  icon: string;
  type: "positive" | "negative" | "neutral";
  showToggle?: boolean;
  onClick?: () => void;
}

interface FinancialCardGridProps {
  cards: FinancialCardData[];
  isBalanceVisible: boolean;
  onToggleVisibility: () => void;
  className?: string;
}

const FinancialCardGrid: React.FC<FinancialCardGridProps> = ({
  cards,
  isBalanceVisible,
  onToggleVisibility,
  className = "",
}) => {
  return (
    <div className={`financial-card-grid ${className}`}>
      {cards.map((card, index) => (
        <UnifiedFinancialCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          type={card.type}
          showToggle={card.showToggle ?? true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={onToggleVisibility}
          onClick={card.onClick}
        />
      ))}
    </div>
  );
};

export default FinancialCardGrid;
