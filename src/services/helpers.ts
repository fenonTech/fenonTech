/**
 * Funções Auxiliares para Serviços
 *
 * Utilitários compartilhados entre os serviços
 */

// ========================================
// 💰 FORMATAÇÃO DE VALORES
// ========================================

/**
 * Formatar valor monetário para exibição
 */
export const formatMoneyDisplay = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

/**
 * Converter string de dinheiro para número
 */
export const parseMoneyValue = (value: string | number): number => {
  if (typeof value === "number") {
    return value;
  }

  // Remove "R$", pontos e substitui vírgula por ponto
  return parseFloat(
    value
      .replace(/[^\d,]/g, "") // Remove tudo exceto dígitos e vírgula
      .replace(",", ".") // Troca vírgula por ponto
  );
};

// ========================================
// 📅 FORMATAÇÃO DE DATAS
// ========================================

/**
 * Formatar data para formato ISO esperado pela API
 */
export const formatDateForApi = (date: string): string => {
  const dateTime = new Date(date + "T00:00:00");
  return dateTime.toISOString().slice(0, 19);
};

/**
 * Formatar data ISO para exibição (DD/MM/YYYY)
 */
export const formatDateForDisplay = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("pt-BR");
};

/**
 * Formatar data ISO para input (YYYY-MM-DD)
 */
export const formatDateForInput = (isoDate: string): string => {
  return isoDate.split("T")[0];
};

/**
 * Verificar se uma data é futura
 */
export const isFutureDate = (date: string | Date): boolean => {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return targetDate > today;
};

/**
 * Obter primeiro dia do mês
 */
export const getFirstDayOfMonth = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
};

/**
 * Obter último dia do mês
 */
export const getLastDayOfMonth = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(
    2,
    "0"
  )}`;
};

// ========================================
// 🔢 CÁLCULOS FINANCEIROS
// ========================================

/**
 * Calcular total de transações
 */
export const calculateTotal = (
  transactions: Array<{ value: number }>
): number => {
  return transactions.reduce((sum, t) => sum + t.value, 0);
};

/**
 * Calcular saldo (receitas - despesas)
 */
export const calculateBalance = (incomes: number, expenses: number): number => {
  return incomes - expenses;
};

/**
 * Agrupar transações por categoria
 */
export const groupByCategory = <T extends { category: string; value: number }>(
  transactions: T[]
): Record<string, number> => {
  return transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.value;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Agrupar transações por mês
 */
export const groupByMonth = <T extends { date: string; value: number }>(
  transactions: T[]
): Record<string, number> => {
  return transactions.reduce((acc, t) => {
    const monthKey = t.date.substring(0, 7); // YYYY-MM
    acc[monthKey] = (acc[monthKey] || 0) + t.value;
    return acc;
  }, {} as Record<string, number>);
};

// ========================================
// 🔍 FILTROS
// ========================================

/**
 * Filtrar transações por período
 */
export const filterByPeriod = <T extends { date: string }>(
  transactions: T[],
  startDate: string,
  endDate: string
): T[] => {
  return transactions.filter((t) => {
    const date = new Date(t.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  });
};

/**
 * Filtrar transações por categoria
 */
export const filterByCategory = <T extends { category: string }>(
  transactions: T[],
  category: string
): T[] => {
  return transactions.filter((t) => t.category === category);
};

/**
 * Filtrar transações futuras
 */
export const filterFutureTransactions = <T extends { date: string }>(
  transactions: T[]
): T[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return transactions.filter((t) => new Date(t.date) > today);
};

/**
 * Filtrar transações passadas
 */
export const filterPastTransactions = <T extends { date: string }>(
  transactions: T[]
): T[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return transactions.filter((t) => new Date(t.date) <= today);
};

// ========================================
// 📊 ESTATÍSTICAS
// ========================================

/**
 * Calcular média de valores
 */
export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
};

/**
 * Encontrar valor máximo
 */
export const findMax = (values: number[]): number => {
  if (values.length === 0) return 0;
  return Math.max(...values);
};

/**
 * Encontrar valor mínimo
 */
export const findMin = (values: number[]): number => {
  if (values.length === 0) return 0;
  return Math.min(...values);
};

// ========================================
// 🎨 CORES PARA CATEGORIAS
// ========================================

const CATEGORY_COLORS = [
  "#FF6B6B", // Vermelho
  "#4ECDC4", // Turquesa
  "#45B7D1", // Azul claro
  "#FFA07A", // Salmão
  "#98D8C8", // Verde claro
  "#F7DC6F", // Amarelo
  "#BB8FCE", // Roxo claro
  "#85C1E2", // Azul céu
  "#F8B88B", // Laranja claro
  "#ABEBC6", // Verde menta
];

/**
 * Obter cor para categoria
 */
export const getCategoryColor = (category: string, index?: number): string => {
  if (index !== undefined) {
    return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  }

  // Gerar cor baseada no hash do nome da categoria
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }

  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
};
