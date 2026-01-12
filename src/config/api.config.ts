/**
 * Configuração centralizada de URLs da API
 *
 * A base URL está configurada nos arquivos de ambiente:
 * - Production: environments/environment.production.ts
 * - Development: environments/environment.development.ts
 *
 * Para mudar a URL da API, edite apenas o arquivo de ambiente correspondente.
 */

import { environment } from "../../environments/environment";

// URL base da API - vem do arquivo de ambiente
export const API_BASE_URL = environment.api.baseUrl;

// Detectar ambiente
export const CURRENT_ENVIRONMENT = environment.name;

// Log do ambiente atual (apenas em dev)
if (!environment.production) {
  console.log("🌍 Ambiente:", CURRENT_ENVIRONMENT);
  console.log("🔗 API URL:", API_BASE_URL);
}

// Endpoints da API (adicione conforme necessário)
export const API_ENDPOINTS = {
  // Autenticação
  auth: {
    login: "/auth/login",
  },

  // Transações
  transacoes: {
    list: "/transacoes", // GET com query params: ?mes={mes}&ano={ano}
  },

  // Entradas (Receitas)
  entradas: {
    list: "/entradas", // GET com query params: ?mes={mes}&ano={ano}
  },

  // Despesas/Saídas
  despesas: {
    list: "/despesas", // GET com query params: ?mes={mes}&ano={ano}
  },

  // Transações (antigo - manter compatibilidade)
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
