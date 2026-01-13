/**
 * Configuração de Ambiente - PRODUÇÃO
 */

export const environment = {
  production: true,
  name: "production",

  // APIs
  api: {
    baseUrl: "https://zvmw5op52c.execute-api.us-east-1.amazonaws.com/prod/api",
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
