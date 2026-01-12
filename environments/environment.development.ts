/**
 * Configuração de Ambiente - DESENVOLVIMENTO
 */

export const environment = {
  production: false,
  name: "development",

  // APIs
  api: {
    baseUrl: "http://localhost:3000/api",
    timeout: 30000,
  },

  // URLs da Aplicação
  app: {
    landingPage: "http://localhost:5174/landingpage",
    dashboard: "http://localhost:5173",
  },

  // Features
  features: {
    enableLogs: true,
    enableDebug: true,
  },
};
