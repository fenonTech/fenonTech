/**
 * Configuração de Ambiente - PRODUÇÃO
 */

export const environment = {
  production: true,
  name: "production",

  // APIs
  api: {
    baseUrl: "https://backend-pearl-rho-82.vercel.app/api",
    timeout: 30000,
  },

  // URLs da Aplicação
  app: {
    landingPage: "https://www.meubolsoia.com.br/landingpage",
    dashboard: "https://www.meubolsoia.com.br/dashboard",
  },

  // Features
  features: {
    enableLogs: false,
    enableDebug: false,
  },
};
