/**
 * Serviço de Transações (Receitas e Despesas)
 *
 * Centraliza todas as operações de transações financeiras
 * Compartilhado entre mobile e desktop
 */

import { api } from "../../config";
import { formatCurrency } from "../../utils";

// ========================================
// 📦 TIPOS E INTERFACES
// ========================================

export interface DadosRequisicao {
  tela: "receita" | "despesa" | "dashboard";
  tipoMetodo: "post" | "update" | "delete" | "get";
  codigoTransacao?: number;
  dataPagamento?: string;
  categoria?: string;
  valor?: number;
  isEntrada?: boolean;
}

export interface ApiPayload {
  dadosRequisicao: DadosRequisicao;
}

export interface CreateTransactionDTO {
  date: string; // formato: "YYYY-MM-DD"
  category: string;
  value: number;
  isIncome: boolean;
}

export interface UpdateTransactionDTO {
  transactionCode: number;
  date: string;
  category: string;
  value: number;
  isIncome: boolean;
}

export interface TransactionFromApi {
  created_at: string;
  descricao: string | null;
  valor: number | null;
  tipo: string | null;
  user_id: number | null;
  data_pagamento: string | null;
  codigo: number;
  is_entrada: boolean | null;
}

export interface LocalTransaction {
  id: string;
  date: string;
  category: string;
  description: string;
  value: number;
  formattedValue: string;
  createdAt: string;
  type: "income" | "expense";
  isFuture: boolean;
}

// ========================================
// 🛠️ FUNÇÕES AUXILIARES
// ========================================

/**
 * Formatar data para formato ISO esperado pela API
 */
const formatDateForApi = (date: string): string => {
  const dateTime = new Date(date + "T00:00:00");
  return dateTime.toISOString().slice(0, 19);
};

/**
 * Converter transação da API para formato local
 */
export const convertApiTransactionToLocal = (
  transaction: TransactionFromApi
): LocalTransaction | null => {
  if (
    !transaction.data_pagamento ||
    !transaction.tipo ||
    transaction.valor === null
  ) {
    return null;
  }

  const dateParts = transaction.data_pagamento.split("T")[0];
  const transactionDate = new Date(transaction.data_pagamento);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isFuture = transactionDate > today;
  const formattedValue = formatCurrency(transaction.valor);

  return {
    id: transaction.codigo.toString(),
    date: dateParts,
    category: transaction.tipo,
    description: transaction.descricao || transaction.tipo,
    value: transaction.valor,
    formattedValue: formattedValue,
    createdAt: transaction.created_at,
    type: transaction.is_entrada ? "income" : "expense",
    isFuture: isFuture,
  };
};

// ========================================
// 📡 SERVIÇO DE TRANSAÇÕES
// ========================================

export const transactionService = {
  /**
   * Criar uma nova transação (receita ou despesa)
   */
  async createTransaction(data: CreateTransactionDTO): Promise<any> {
    try {
      const isoDateTime = formatDateForApi(data.date);
      const tela = data.isIncome ? "receita" : "despesa";

      const payload: ApiPayload = {
        dadosRequisicao: {
          tela: tela,
          tipoMetodo: "post",
          dataPagamento: isoDateTime,
          categoria: data.category,
          valor: data.value,
          isEntrada: data.isIncome,
        },
      };

      console.log("📤 Enviando transação para API:", payload);

      const response = await api.post("", payload);

      console.log("✅ Transação criada com sucesso:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Erro ao criar transação:", error);

      if (error.response) {
        throw new Error(
          `Erro ao criar transação: ${
            error.response.data?.message || error.message
          }`
        );
      } else if (error.request) {
        throw new Error("Sem resposta do servidor. Verifique sua conexão.");
      } else {
        throw new Error(`Erro: ${error.message}`);
      }
    }
  },

  /**
   * Criar uma receita
   */
  async createIncome(
    data: Omit<CreateTransactionDTO, "isIncome">
  ): Promise<any> {
    return this.createTransaction({
      ...data,
      isIncome: true,
    });
  },

  /**
   * Criar uma despesa
   */
  async createExpense(
    data: Omit<CreateTransactionDTO, "isIncome">
  ): Promise<any> {
    return this.createTransaction({
      ...data,
      isIncome: false,
    });
  },

  /**
   * Buscar todas as receitas
   */
  async getIncomes(): Promise<TransactionFromApi[]> {
    try {
      const payload = {
        dadosRequisicao: {
          tela: "receita" as const,
          tipoMetodo: "get" as const,
        },
      };

      console.log("📥 Buscando receitas da API:", payload);

      const response = await api.post("", payload);

      console.log("✅ Receitas recebidas:", response.data);

      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error("❌ Erro ao buscar receitas:", error);
      throw error;
    }
  },

  /**
   * Buscar todas as despesas
   */
  async getExpenses(): Promise<TransactionFromApi[]> {
    try {
      const payload = {
        dadosRequisicao: {
          tela: "despesa" as const,
          tipoMetodo: "get" as const,
        },
      };

      console.log("📥 Buscando despesas da API:", payload);

      const response = await api.post("", payload);

      console.log("✅ Despesas recebidas:", response.data);

      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error("❌ Erro ao buscar despesas:", error);
      throw error;
    }
  },

  /**
   * Buscar todas as transações (receitas + despesas)
   */
  async getAllTransactions(): Promise<LocalTransaction[]> {
    try {
      const [incomes, expenses] = await Promise.all([
        this.getIncomes(),
        this.getExpenses(),
      ]);

      const allTransactions = [...incomes, ...expenses];

      const convertedTransactions = allTransactions
        .map(convertApiTransactionToLocal)
        .filter((t): t is LocalTransaction => t !== null);

      // Ordenar por data (mais recente primeiro)
      convertedTransactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return convertedTransactions;
    } catch (error: any) {
      console.error("❌ Erro ao buscar todas transações:", error);
      throw error;
    }
  },

  /**
   * Atualizar uma transação existente
   */
  async updateTransaction(data: UpdateTransactionDTO): Promise<any> {
    try {
      const isoDateTime = formatDateForApi(data.date);
      const tela = data.isIncome ? "receita" : "despesa";

      const payload: ApiPayload = {
        dadosRequisicao: {
          tela: tela,
          tipoMetodo: "update",
          codigoTransacao: data.transactionCode,
          dataPagamento: isoDateTime,
          categoria: data.category,
          valor: data.value,
        },
      };

      console.log("📝 Atualizando transação na API:", payload);

      const response = await api.post("", payload);

      console.log("✅ Transação atualizada com sucesso:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Erro ao atualizar transação:", error);

      if (error.response) {
        throw new Error(
          `Erro ao atualizar transação: ${
            error.response.data?.message || error.message
          }`
        );
      } else if (error.request) {
        throw new Error("Sem resposta do servidor. Verifique sua conexão.");
      } else {
        throw new Error(`Erro: ${error.message}`);
      }
    }
  },

  /**
   * Atualizar uma receita
   */
  async updateIncome(
    data: Omit<UpdateTransactionDTO, "isIncome">
  ): Promise<any> {
    return this.updateTransaction({
      ...data,
      isIncome: true,
    });
  },

  /**
   * Atualizar uma despesa
   */
  async updateExpense(
    data: Omit<UpdateTransactionDTO, "isIncome">
  ): Promise<any> {
    return this.updateTransaction({
      ...data,
      isIncome: false,
    });
  },

  /**
   * Deletar uma transação
   */
  async deleteTransaction(
    transactionCode: number,
    isIncome: boolean
  ): Promise<any> {
    try {
      const tela = isIncome ? "receita" : "despesa";

      const payload = {
        dadosRequisicao: {
          tela: tela,
          tipoMetodo: "delete" as const,
          codigoTransacao: transactionCode,
        },
      };

      console.log("🗑️ Deletando transação na API:", payload);

      const response = await api.post("", payload);

      console.log("✅ Transação deletada com sucesso:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Erro ao deletar transação:", error);

      if (error.response) {
        throw new Error(
          `Erro ao deletar transação: ${
            error.response.data?.message || error.message
          }`
        );
      } else if (error.request) {
        throw new Error("Sem resposta do servidor. Verifique sua conexão.");
      } else {
        throw new Error(`Erro: ${error.message}`);
      }
    }
  },

  /**
   * Deletar uma receita
   */
  async deleteIncome(transactionCode: number): Promise<any> {
    return this.deleteTransaction(transactionCode, true);
  },

  /**
   * Deletar uma despesa
   */
  async deleteExpense(transactionCode: number): Promise<any> {
    return this.deleteTransaction(transactionCode, false);
  },
};
