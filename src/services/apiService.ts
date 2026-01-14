import type {
  Transaction,
  FinancialSummary,
  Bank,
  Category,
  WebhookPayload,
  N8NWebhookResponse,
  ApiResponse,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://https://backend-pearl-rho-82.vercel.app/api";
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "";
const N8N_API_KEY = import.meta.env.VITE_N8N_API_KEY || "";

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${N8N_API_KEY}`,
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro na requisição");
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Erro na API:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  // Transações
  async getTransactions(filters?: {
    type?: "receita" | "despesa";
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<Transaction[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    return this.request<Transaction[]>(`/transactions?${params.toString()}`);
  }

  async createTransaction(
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    });
  }

  async updateTransaction(
    id: string,
    transaction: Partial<Transaction>
  ): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(transaction),
    });
  }

  async deleteTransaction(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/transactions/${id}`, {
      method: "DELETE",
    });
  }

  // Resumo financeiro
  async getFinancialSummary(
    period?: string
  ): Promise<ApiResponse<FinancialSummary>> {
    const params = period ? `?period=${period}` : "";
    return this.request<FinancialSummary>(`/summary${params}`);
  }

  // Categorias
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>("/categories");
  }

  async createCategory(
    category: Omit<Category, "id">
  ): Promise<ApiResponse<Category>> {
    return this.request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(category),
    });
  }

  // Bancos
  async getBanks(): Promise<ApiResponse<Bank[]>> {
    return this.request<Bank[]>("/banks");
  }

  async syncBank(bankId: string): Promise<ApiResponse<Bank>> {
    return this.request<Bank>(`/banks/${bankId}/sync`, {
      method: "POST",
    });
  }

  // Webhook para N8N
  async sendToN8N(payload: WebhookPayload): Promise<N8NWebhookResponse> {
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Erro ao enviar para N8N:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  // Método para receber webhooks do N8N
  async handleWebhook(payload: WebhookPayload): Promise<void> {
    try {
      console.log("Webhook recebido do N8N:", payload);

      // Aqui você pode processar os dados conforme necessário
      switch (payload.event) {
        case "transaction.created":
          // Atualizar estado local com nova transação
          break;
        case "transaction.updated":
          // Atualizar transação existente
          break;
        case "transaction.deleted":
          // Remover transação do estado
          break;
        case "summary.updated":
          // Atualizar resumo financeiro
          break;
        default:
          console.warn("Evento de webhook não reconhecido:", payload.event);
      }
    } catch (error) {
      console.error("Erro ao processar webhook:", error);
    }
  }
}

export const apiService = new ApiService();
