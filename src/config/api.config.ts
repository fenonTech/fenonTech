/**
 * Configuração centralizada de URLs da API
 *
 * Agora usando variáveis de ambiente do Vite
 * - Development: usa environments/.env.development
 * - Production: usa environments/.env.production
 */

// Obter URL da API das variáveis de ambiente
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Detectar ambiente
export const CURRENT_ENVIRONMENT = import.meta.env.MODE;

// Log do ambiente atual (apenas em dev)
if (import.meta.env.DEV) {
  console.log("🌍 Ambiente:", CURRENT_ENVIRONMENT);
  console.log("🔗 API URL:", API_BASE_URL);
}

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
