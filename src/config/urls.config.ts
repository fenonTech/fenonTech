/**
 * Configuração centralizada de URLs da aplicação
 * Usando variáveis de ambiente do Vite
 */

// URLs das variáveis de ambiente
const LANDING_PAGE_BASE_URL = import.meta.env.VITE_LANDING_PAGE_URL;
const DASHBOARD_BASE_URL = import.meta.env.VITE_DASHBOARD_URL;

// URLs específicas da aplicação
export const APP_URLS = {
  // Landing page base+
  LANDING_PAGE_BASE: LANDING_PAGE_BASE_URL,

  // Páginas específicas da landing page
  LOGIN: `${LANDING_PAGE_BASE_URL}/index.html#/login`,
  PLANOS: `${LANDING_PAGE_BASE_URL}/index.html#/planos`,
  RENOVAR: `${LANDING_PAGE_BASE_URL}/index.html#/renovar`,

  // Dashboard (atual aplicação)
  DASHBOARD_BASE: DASHBOARD_BASE_URL,
} as const;

export default APP_URLS;
