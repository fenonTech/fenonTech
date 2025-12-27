/**
 * Exportações centralizadas de configurações
 */

export * from "./api.config";
export { default as apiClient, api } from "./axios.config";
export type { ApiResponse, ApiError } from "./axios.config";
export { default as APP_URLS } from "./urls.config";
