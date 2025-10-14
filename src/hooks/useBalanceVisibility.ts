import { useCallback } from "react";
import { useFinancial } from "../contexts/FinancialContext";

interface UseBalanceVisibilityReturn {
  isBalanceVisible: boolean;
  toggleBalanceVisibility: () => void;
  formatValue: (value: string) => string;
}

export const useBalanceVisibility = (): UseBalanceVisibilityReturn => {
  const { state, toggleBalanceVisibility } = useFinancial();
  const { isBalanceVisible } = state;

  const formatValue = useCallback(
    (value: string): string => {
      if (isBalanceVisible) {
        return value;
      }

      // Transformar valor em asteriscos mantendo a estrutura
      const cleanValue = value.replace(/[^\d,.-]/g, ""); // Remove símbolos monetários
      const length = cleanValue.length;

      // Criar padrão de asteriscos baseado no tamanho do valor
      if (length <= 4) {
        return "• • •";
      } else if (length <= 7) {
        return "• • • •";
      } else {
        return "• • • • •";
      }
    },
    [isBalanceVisible]
  );

  return {
    isBalanceVisible,
    toggleBalanceVisibility,
    formatValue,
  };
};
