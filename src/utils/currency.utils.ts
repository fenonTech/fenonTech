/**
 * Utilitários para formatação de valores monetários
 * Padronização: R$ 1.000,00 (formato brasileiro)
 */

/**
 * Formata um número para o padrão monetário brasileiro
 * @param value - Valor numérico a ser formatado
 * @returns String formatada no padrão R$ 1.000,00
 */
export const formatCurrency = (value: number): string => {
  if (isNaN(value) || value === null || value === undefined) {
    return "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Converte string monetária brasileira para número
 * @param currencyString - String no formato "R$ 1.000,00"
 * @returns Valor numérico
 */
export const parseCurrency = (currencyString: string): number => {
  if (!currencyString || typeof currencyString !== "string") {
    return 0;
  }

  // Remove "R$", espaços, pontos e substitui vírgula por ponto
  const cleanValue = currencyString
    .replace(/R\$\s?/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Formata valor para exibição nos cards (com aplicação de visibilidade)
 * @param value - Valor numérico
 * @param isVisible - Se deve mostrar o valor ou asteriscos
 * @returns String formatada ou asteriscos
 */
export const formatCardValue = (
  value: number,
  isVisible: boolean = true
): string => {
  if (!isVisible) {
    // Retorna asteriscos baseado no tamanho do valor
    const formatted = formatCurrency(value);
    const cleanValue = formatted.replace(/[^\d,.-]/g, "");
    const length = cleanValue.length;

    if (length <= 4) {
      return "• • •";
    } else if (length <= 7) {
      return "• • • •";
    } else {
      return "• • • • •";
    }
  }

  return formatCurrency(value);
};

/**
 * Formata string já formatada para garantir padronização
 * @param formattedValue - Valor já formatado como string
 * @returns String formatada padronizada
 */
export const ensureStandardFormat = (formattedValue: string): string => {
  const numericValue = parseCurrency(formattedValue);
  return formatCurrency(numericValue);
};
