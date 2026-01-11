/**
 * Configuração de Ambiente - Seletor Automático
 *
 * Este arquivo exporta o ambiente correto baseado no modo de build do Vite
 */

// @ts-ignore
const isDevelopment = import.meta.env.DEV;

// Importar o ambiente correto
export const environment = isDevelopment
  ? await import("./environment.development").then((m) => m.environment)
  : await import("./environment.production").then((m) => m.environment);

export default environment;
