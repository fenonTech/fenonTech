/**
 * Configuração centralizada de URLs da API
 *
 * 🔥 INSTRUÇÕES DE USO:
 * Para trocar entre ambientes, comente/descomente as linhas abaixo:
 * - Deixe apenas UMA linha descomentada
 * - As outras linhas devem estar comentadas com //
 */

// ========================================
// 🚀 SELECIONE A URL DA API AQUI:
// ========================================

// ✅ Desenvolvimento (Teste) - ATIVA
export const API_BASE_URL =
  // "https://n8n.srv1056458.hstgr.cloud/webhook-test/meuBolso";

  // 🚀 Produção - DESCOMENTANDO ESTA LINHA, COMENTE A DE CIMA
  "https://n8n.srv1056458.hstgr.cloud/webhook/meuBolso";

// ========================================

// Detectar ambiente automaticamente baseado na URL ativa
export const CURRENT_ENVIRONMENT = API_BASE_URL.includes("webhook-test")
  ? "development"
  : "production";

// Endpoints da API (adicione conforme necessário)
export const API_ENDPOINTS = {
  // Transações
  transactions: {
    list: "/transactions",
    create: "/transactions",
    update: (id: string) => `/transactions/${id}`,
    delete: (id: string) => `/transactions/${id}`,
  },

  // Receitas
  incomes: {
    list: "/incomes",
    create: "/incomes",
    update: (id: string) => `/incomes/${id}`,
    delete: (id: string) => `/incomes/${id}`,
  },

  // Despesas
  expenses: {
    list: "/expenses",
    create: "/expenses",
    update: (id: string) => `/expenses/${id}`,
    delete: (id: string) => `/expenses/${id}`,
  },

  // Planejamento/Orçamento
  budgets: {
    list: "/budgets",
    create: "/budgets",
    update: (id: string) => `/budgets/${id}`,
    delete: (id: string) => `/budgets/${id}`,
  },

  // Categorias
  categories: {
    list: "/categories",
    create: "/categories",
    update: (id: string) => `/categories/${id}`,
    delete: (id: string) => `/categories/${id}`,
  },
};

// Helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
