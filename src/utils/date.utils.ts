/**
 * Utilitários para manipulação segura de datas
 */

/**
 * Cria uma data de forma segura a partir de uma string no formato ISO
 * Evita problemas de timezone ao interpretar datas, extraindo apenas a parte da data
 * @param dateString - String da data no formato YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss+timezone
 * @returns Date object no timezone local
 */
export const createSafeDate = (dateString: string): Date => {
  if (!dateString || typeof dateString !== "string") {
    return new Date();
  }

  // Extrair apenas a parte da data (YYYY-MM-DD) ignorando horário e timezone
  const dateOnly = dateString.split("T")[0];

  // Verificar se o formato está correto
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    console.warn("Formato de data inválido:", dateString);
    return new Date();
  }

  return new Date(dateOnly + "T12:00:00");
};

/**
 * Formata uma data para exibição em tabelas (DD/MM format)
 * @param dateString - String da data
 * @returns String formatada DD/MM
 */
export const formatTableDate = (dateString: string): string => {
  if (!dateString) {
    return "--/--";
  }

  try {
    const date = createSafeDate(dateString);

    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return "--/--";
    }

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  } catch (error) {
    console.warn("Erro ao formatar data:", dateString, error);
    return "--/--";
  }
};

/**
 * Formata uma data completa (DD/MM/YYYY)
 * @param dateString - String da data
 * @returns String formatada DD/MM/YYYY
 */
export const formatFullDate = (dateString: string): string => {
  const date = createSafeDate(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Verifica se uma data é hoje ou anterior (para filtrar atual vs. futuro)
 * @param dateString - String da data
 * @returns true se a data é hoje ou anterior
 */
export const isDateTodayOrBefore = (dateString: string): boolean => {
  const date = createSafeDate(dateString);
  const today = new Date();

  // Zerar horário para comparação apenas de data
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return date <= today;
};
