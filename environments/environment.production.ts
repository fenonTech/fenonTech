/**
 * Configuração de Ambiente - PRODUÇÃO
 */

export const environment = {
  production: true,
  name: "production",

  // APIs
  api: {
    baseUrl: "https://n8n.srv1056458.hstgr.cloud/webhook/meuBolso",
    timeout: 30000,
  },

  // URLs da Aplicação
  app: {
    landingPage: "https://www.fenontech.com.br/landingpage",
    dashboard: "https://www.fenontech.com.br/dashboard",
  },

  // Features
  features: {
    enableLogs: false,
    enableDebug: false,
  },
};
