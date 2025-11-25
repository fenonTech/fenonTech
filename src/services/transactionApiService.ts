/**
 * Serviço para gerenciar transações (Receitas e Despesas) via API
 */

import { api } from "../config";

// ========================================
// 🔒 DADOS FIXOS - Usados em todas as requisições
// ========================================
const TELEFONE_FIXO = "+5511911451180";
const CODIGO_TEMP_FIXO = "0vr84e";

// Tipos para a estrutura da API
export interface DadosRequisicao {
  tela: "receita" | "despesa";
  tipoMetodo: "post" | "update" | "delete" | "get";
  codigoTransacao?: number; // Código da transação para update e delete
  dataPagamento?: string; // formato ISO: "2025-05-01T05:06:00"
  categoria?: string;
  valor?: number;
  isEntrada?: boolean; // true = receita, false = despesa
}

export interface ApiPayload {
  telefone: string;
  codigoTemp: string;
  dadosRequisicao: DadosRequisicao;
}

export interface CreateTransactionDTO {
  date: string; // formato: "YYYY-MM-DD"
  category: string;
  value: number;
  isIncome: boolean; // true = receita, false = despesa
}

export interface UpdateTransactionDTO {
  transactionCode: number; // Código da transação a ser atualizada
  date: string; // formato: "YYYY-MM-DD"
  category: string;
  value: number;
  isIncome: boolean; // true = receita, false = despesa
}

// Tipos para a resposta da API
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

/**
 * Serviço de transações
 */
export const transactionApiService = {
  /**
   * Criar uma nova transação (receita ou despesa)
   * @param data Dados da transação
   * @returns Promise com a resposta da API
   */
  async createTransaction(data: CreateTransactionDTO): Promise<any> {
    try {
      // Converter a data para o formato ISO com horário
      const dateTime = new Date(data.date + "T00:00:00");
      const isoDateTime = dateTime.toISOString().slice(0, 19); // Remove o 'Z' do final

      // Determinar a tela baseada no tipo (receita ou despesa)
      const tela = data.isIncome ? "receita" : "despesa";

      // Montar o payload conforme o novo formato da API
      const payload: ApiPayload = {
        telefone: TELEFONE_FIXO,
        codigoTemp: CODIGO_TEMP_FIXO,
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

      // Fazer a requisição POST
      const response = await api.post("", payload); // URL base já está configurada

      console.log("✅ Transação criada com sucesso:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Erro ao criar transação:", error);

      // Tratamento de erros mais detalhado
      if (error.response) {
        console.error("Detalhes do erro:", {
          status: error.response.status,
          data: error.response.data,
        });
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
   * @param data Dados da receita
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
   * @param data Dados da despesa
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
   * @returns Promise com array de transações
   */
  async getIncomes(): Promise<TransactionFromApi[]> {
    try {
      const payload = {
        telefone: TELEFONE_FIXO,
        codigoTemp: CODIGO_TEMP_FIXO,
        dadosRequisicao: {
          tela: "receita" as const,
          tipoMetodo: "get" as const,
        },
      };

      console.log("📥 Buscando receitas da API:", payload);

      const response = await api.post("", payload);

      console.log("✅ Receitas recebidas:", response.data);

      // A API retorna direto o array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error("❌ Erro ao buscar receitas:", error);
      throw error;
    }
  },

  /**
   * Buscar todas as despesas
   * @returns Promise com array de transações
   */
  async getExpenses(): Promise<TransactionFromApi[]> {
    try {
      const payload = {
        telefone: TELEFONE_FIXO,
        codigoTemp: CODIGO_TEMP_FIXO,
        dadosRequisicao: {
          tela: "despesa" as const,
          tipoMetodo: "get" as const,
        },
      };

      console.log("📥 Buscando despesas da API:", payload);

      const response = await api.post("", payload);

      console.log("✅ Despesas recebidas:", response.data);

      // A API retorna direto o array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error("❌ Erro ao buscar despesas:", error);
      throw error;
    }
  },

  /**
   * Atualizar uma transação existente (receita ou despesa)
   * @param data Dados da transação a ser atualizada
   * @returns Promise com a resposta da API
   */
  async updateTransaction(data: UpdateTransactionDTO): Promise<any> {
    try {
      // Converter a data para o formato ISO com horário
      const dateTime = new Date(data.date + "T00:00:00");
      const isoDateTime = dateTime.toISOString().slice(0, 19);

      // Determinar a tela baseada no tipo (receita ou despesa)
      const tela = data.isIncome ? "receita" : "despesa";

      // Montar o payload conforme o formato da API
      const payload: ApiPayload = {
        telefone: TELEFONE_FIXO,
        codigoTemp: CODIGO_TEMP_FIXO,
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
   * @param data Dados da receita
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
   * @param data Dados da despesa
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
   * Deletar uma transação (receita ou despesa)
   * @param transactionCode Código da transação
   * @param isIncome Se true, é receita; se false, é despesa
   * @returns Promise com a resposta da API
   */
  async deleteTransaction(
    transactionCode: number,
    isIncome: boolean
  ): Promise<any> {
    try {
      // Determinar a tela baseada no tipo (receita ou despesa)
      const tela = isIncome ? "receita" : "despesa";

      // Montar o payload conforme o formato da API
      const payload = {
        telefone: TELEFONE_FIXO,
        codigoTemp: CODIGO_TEMP_FIXO,
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
   * @param transactionCode Código da transação
   */
  async deleteIncome(transactionCode: number): Promise<any> {
    return this.deleteTransaction(transactionCode, true);
  },

  /**
   * Deletar uma despesa
   * @param transactionCode Código da transação
   */
  async deleteExpense(transactionCode: number): Promise<any> {
    return this.deleteTransaction(transactionCode, false);
  },

  /**
   * Buscar dados do Dashboard
   * @returns Promise com os dados do dashboard
   */
  async getDashboardData(): Promise<any> {
    try {
      const payload = {
        telefone: TELEFONE_FIXO,
        codigoTemp: CODIGO_TEMP_FIXO,
        dadosRequisicao: {
          tela: "dashboard",
          tipoMetodo: "get",
        },
      };

      console.log("📊 Buscando dados do dashboard da API:", payload);

      const response = await api.post("", payload);

      console.log("✅ Dados do dashboard recebidos:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Erro ao buscar dados do dashboard:", error);

      if (error.response) {
        throw new Error(
          `Erro ao buscar dados do dashboard: ${
            error.response.data?.message || error.response.statusText
          }`
        );
      } else if (error.request) {
        throw new Error("Sem resposta do servidor. Verifique sua conexão.");
      } else {
        throw new Error(`Erro: ${error.message}`);
      }
    }
  },
};

/**
 * Helper para formatar valor monetário para número
 * @param value Valor em string (ex: "R$ 1.234,56")
 * @returns Número (ex: 1234.56)
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

/**
 * Helper para formatar data no formato esperado pela API
 * @param date Data em formato "YYYY-MM-DD"
 * @returns Data em formato ISO "YYYY-MM-DDTHH:MM:SS"
 */
export const formatDateForApi = (date: string): string => {
  const dateTime = new Date(date + "T00:00:00");
  return dateTime.toISOString().slice(0, 19);
};

/**
 * Helper para converter transação da API para formato local
 * @param transaction Transação da API
 * @returns Transação no formato local
 */
export const convertApiTransactionToLocal = (
  transaction: TransactionFromApi
) => {
  // Validar se a transação tem dados válidos
  if (
    !transaction.data_pagamento ||
    !transaction.tipo ||
    transaction.valor === null
  ) {
    return null;
  }

  // Extrair data do ISO string (apenas a parte da data)
  const dateParts = transaction.data_pagamento.split("T")[0]; // "2025-11-25"

  // Verificar se é futura (a receber/pagar) ou passada (recebida/paga)
  const transactionDate = new Date(transaction.data_pagamento);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isFuture = transactionDate > today;

  const formattedValue = `R$ ${transaction.valor.toFixed(2).replace(".", ",")}`;

  return {
    id: transaction.codigo.toString(),
    date: dateParts,
    category: transaction.tipo,
    description: transaction.descricao || transaction.tipo,
    value: transaction.valor,
    formattedValue: formattedValue,
    createdAt: transaction.created_at,
    type: transaction.is_entrada ? "income" : "expense",
    isFuture: isFuture, // Para determinar se é "a receber/pagar"
  };
};
