/**
 * Configuração de Ambiente - Seletor Automático
 *
 * Este arquivo exporta o ambiente correto baseado no modo de build do Vite
 *
 * IMPORTANTE: Para mudar a URL da API, edite:
 * - Desenvolvimento: environment.development.ts
 * - Produção: environment.production.ts
 *
 * A URL base atual é: https://zvmw5op52c.execute-api.us-east-1.amazonaws.com/prod/api
 */

import { environment as devEnvironment } from "./environment.development";
import { environment as prodEnvironment } from "./environment.production";

// Seleciona o ambiente correto baseado no modo do Vite
export const environment = import.meta.env.DEV
  ? devEnvironment
  : prodEnvironment;

export default environment;
