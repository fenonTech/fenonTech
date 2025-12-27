import { useCallback } from "react";
import { useFinancial } from "../contexts/FinancialContext";
import { formatCardValue, parseCurrency } from "../utils";

interface UseBalanceVisibilityReturn {
  isBalanceVisible: boolean;
  toggleBalanceVisibility: () => void;
  formatValue: (value: string | number) => string;
}

export const useBalanceVisibility = (): UseBalanceVisibilityReturn => {
  const { state, toggleBalanceVisibility } = useFinancial();
  const { isBalanceVisible } = state;

  const formatValue = useCallback(
    (value: string | number): string => {
      // Se receber um número, formatar diretamente
      if (typeof value === "number") {
        return formatCardValue(value, isBalanceVisible);
      }

      // Se receber uma string, converter para número e formatar
      const numericValue = parseCurrency(value);
      return formatCardValue(numericValue, isBalanceVisible);
    },
    [isBalanceVisible]
  );

  return {
    isBalanceVisible,
    toggleBalanceVisibility,
    formatValue,
  };
};
