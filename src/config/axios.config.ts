import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL, CURRENT_ENVIRONMENT } from "./api.config";

/**
 * Instância configurada do Axios para fazer requisições à API
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Interceptor de Request
 * Adiciona tokens, logs, etc antes de enviar a requisição
 */
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    // Log em desenvolvimento
    if (CURRENT_ENVIRONMENT === "development") {
      console.log("📤 API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    // Adicione aqui lógica para tokens de autenticação quando necessário
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Response
 * Trata respostas e erros globalmente
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log em desenvolvimento
    if (CURRENT_ENVIRONMENT === "development") {
      console.log("📥 API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError) => {
    // Tratamento de erros global
    if (error.response) {
      // Servidor respondeu com status de erro
      console.error("❌ API Error Response:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });

      // API retorna apenas 200 (sucesso) ou 401 (não autorizado)
      if (error.response.status === 401) {
        console.error(
          "🔒 Não autorizado - Credenciais inválidas ou sessão expirada"
        );

        // Marcar sessão como expirada
        localStorage.setItem("fenontech-session-expired", "true");

        // Recarregar página para mostrar tela de sessão expirada
        window.location.reload();
      } else {
        console.error("⚠️ Status inesperado:", error.response.status);
      }
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error(
        "📡 Sem resposta do servidor - Verifique sua conexão ou se a API está online"
      );
    } else {
      // Erro na configuração da requisição
      console.error("⚙️ Erro na configuração da requisição:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * Helper types para requisições tipadas
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

/**
 * Funções auxiliares para requisições comuns
 */
export const api = {
  // GET request
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<ApiResponse<T>>(url, config),

  // POST request
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<ApiResponse<T>>(url, data, config),

  // PUT request
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<ApiResponse<T>>(url, data, config),

  // PATCH request
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<ApiResponse<T>>(url, data, config),

  // DELETE request
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<ApiResponse<T>>(url, config),
};
