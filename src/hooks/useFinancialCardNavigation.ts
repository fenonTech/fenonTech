import { useState } from "react";

export type FinancialCardType = "saldo" | "receita" | "despesa";

export const useFinancialCardNavigation = (
  initialCard: FinancialCardType = "saldo"
) => {
  const [activeCard, setActiveCard] = useState<FinancialCardType>(initialCard);

  const switchCard = (cardType: FinancialCardType) => {
    setActiveCard(cardType);
  };

  const getCardData = () => {
    switch (activeCard) {
      case "saldo":
        return {
          title: "Saldo Atual",
          value: "R$ 1.250,37",
          type: "neutral" as const,
          description: "Seu saldo disponível",
        };
      case "receita":
        return {
          title: "Receita atual",
          value: "R$ 2.850,00",
          type: "positive" as const,
          description: "Total de entradas no mês",
        };
      case "despesa":
        return {
          title: "DESPESA ATUAL",
          value: "R$ 1.599,63",
          type: "negative" as const,
          description: "Total de gastos no mês",
        };
      default:
        return {
          title: "Saldo Atual",
          value: "R$ 1.250,37",
          type: "neutral" as const,
          description: "Seu saldo disponível",
        };
    }
  };

  return {
    activeCard,
    switchCard,
    cardData: getCardData(),
  };
};

export default useFinancialCardNavigation;
