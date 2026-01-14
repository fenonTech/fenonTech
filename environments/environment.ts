/**
 * Configuração de Ambiente - Seletor Automático
 *
 * Este arquivo exporta o ambiente correto baseado no modo de build do Vite
 *
 * IMPORTANTE: Para mudar a URL da API, edite:
 * - Desenvolvimento: environment.development.ts
 * - Produção: environment.production.ts
 *
 * A URL base atual é: https://backend-pearl-rho-82.vercel.app/api
 */

import { environment as devEnvironment } from "./environment.development";
import { environment as prodEnvironment } from "./environment.production";

// Seleciona o ambiente correto baseado no modo do Vite
export const environment = import.meta.env.DEV
  ? devEnvironment
  : prodEnvironment;

export default environment;
