import { useCallback, useState } from "react";
import { formatCardValue, parseCurrency } from "../utils";

interface UseBalanceVisibilityReturn {
  isBalanceVisible: boolean;
  toggleBalanceVisibility: () => void;
  formatValue: (value: string | number) => string;
}

export const useBalanceVisibility = (): UseBalanceVisibilityReturn => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const toggleBalanceVisibility = useCallback(() => {
    setIsBalanceVisible((prev) => !prev);
  }, []);

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
