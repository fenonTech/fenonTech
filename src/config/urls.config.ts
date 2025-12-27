/**
 * Configuração centralizada de URLs da aplicação
 * Para facilitar mudanças entre ambientes (produção/teste)
 */

// URL base da landing page (pode ser alterada para teste)
const LANDING_PAGE_BASE_URL = "https://www.fenontech.com.br/landingpage";
// const LANDING_PAGE_BASE_URL = "http://localhost:5174/landingpage/";

// URLs específicas da aplicação
export const APP_URLS = {
  // Landing page base+
  LANDING_PAGE_BASE: LANDING_PAGE_BASE_URL,

  // Páginas específicas da landing page
  LOGIN: `${LANDING_PAGE_BASE_URL}/index.html#/login`,
  PLANOS: `${LANDING_PAGE_BASE_URL}/index.html#/planos`,
  RENOVAR: `${LANDING_PAGE_BASE_URL}/index.html#/renovar`,

  // Dashboard (atual aplicação)
  DASHBOARD_BASE: "https://www.fenontech.com.br/dashboard",
} as const;

export default APP_URLS;
