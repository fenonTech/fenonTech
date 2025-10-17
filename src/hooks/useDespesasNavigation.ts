import { useState } from "react";

type DespesaCardType = "despesas" | "contas";

interface DespesaCardData {
  title: string;
  value: string;
  type: "negative" | "neutral";
}

export const useDespesasNavigation = (
  initialCard: DespesaCardType = "despesas"
) => {
  const [activeCard, setActiveCard] = useState<DespesaCardType>(initialCard);

  const switchCard = (cardType: DespesaCardType) => {
    setActiveCard(cardType);
  };

  const getCardData = (): DespesaCardData => {
    switch (activeCard) {
      case "despesas":
        return {
          title: "DESPESA ATUAL",
          value: "R$ 1.185,70",
          type: "negative",
        };
      case "contas":
        return {
          title: "Contas a pagar",
          value: "R$ 729,90",
          type: "neutral",
        };
      default:
        return {
          title: "DESPESA ATUAL",
          value: "R$ 1.185,70",
          type: "negative",
        };
    }
  };

  const cardData = getCardData();

  return {
    activeCard,
    switchCard,
    cardData,
  };
};

export default useDespesasNavigation;
