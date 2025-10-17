import { useState, useCallback } from "react";

export type ReceitasCardType = "receita" | "contas-a-receber";

interface CardData {
  title: string;
  value: string;
  type: "positive" | "negative" | "neutral";
}

interface UseReceitasNavigationReturn {
  activeCard: ReceitasCardType;
  switchCard: (cardType: ReceitasCardType) => void;
  cardData: CardData;
}

const useReceitasNavigation = (
  initialCard: ReceitasCardType = "receita"
): UseReceitasNavigationReturn => {
  const [activeCard, setActiveCard] = useState<ReceitasCardType>(initialCard);

  const switchCard = useCallback((cardType: ReceitasCardType) => {
    setActiveCard(cardType);
  }, []);

  const getCardData = useCallback((): CardData => {
    switch (activeCard) {
      case "receita":
        return {
          title: "Receita Atual",
          value: "R$ 1.250,37",
          type: "positive",
        };
      case "contas-a-receber":
        return {
          title: "Valores a Receber",
          value: "R$ 600,00",
          type: "neutral",
        };
      default:
        return {
          title: "Receita Atual",
          value: "R$ 1.250,37",
          type: "positive",
        };
    }
  }, [activeCard]);

  return {
    activeCard,
    switchCard,
    cardData: getCardData(),
  };
};

export default useReceitasNavigation;
