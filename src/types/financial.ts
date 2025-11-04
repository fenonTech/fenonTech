// Types para dados financeiros vindos do n8n
export interface Transaction {
  id: string;
  type: "receita" | "despesa";
  amount: number;
  description: string;
  category: string;
  date: string;
  source?: string;
  tags?: string[];
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSummary {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  periodo: string;
}

export interface Category {
  id: string;
  name: string;
  type: "receita" | "despesa";
  color: string;
  icon?: string;
  budget?: number;
}

export interface Bank {
  id: string;
  name: string;
  type: string;
  balance: number;
  accountNumber?: string;
  isConnected: boolean;
  lastSync?: string;
}

export interface WebhookPayload {
  event:
    | "transaction.created"
    | "transaction.updated"
    | "transaction.deleted"
    | "summary.updated";
  data: Transaction | FinancialSummary | { id: string };
  timestamp: string;
  source: string;
}

export interface N8NWebhookResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Types para planejamento/orçamento
export interface Budget {
  id: string;
  category: string;
  plannedAmount: number;
  month: number; // 0-11 (Janeiro = 0, Dezembro = 11)
  year: number;
  type: "expense" | "income";
  formattedValue: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetSummary {
  category: string;
  planned: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: "under" | "equal" | "over"; // abaixo, igual ou acima do planejado
}
