/**
 * Serviço de Autenticação
 *
 * Gerencia credenciais de usuário e autenticação
 * Compartilhado entre mobile e desktop
 */

import apiClient from "../config/axios.config";
import { API_ENDPOINTS } from "../config/api.config";

export interface LoginRequest {
  telefone: string;
  codigo: string;
}

export interface LoginResponse {
  status: boolean;
  status_code: number;
  message: string;
  token?: string;
  usuario?: {
    id: number;
    nome: string;
    telefone: string;
  };
  assinatura?: {
    ativa: boolean;
    tipo: string;
  };
}

/**
 * Chaves do localStorage
 */
const STORAGE_KEYS = {
  TOKEN: "fenontech-token",
  USER_NAME: "fenontech-user-name",
  SUBSCRIPTION: "fenontech-subscription",
} as const;

/**
 * Serviço de autenticação
 */
export const authService = {
  /**
   * Fazer login na API
   * @param telefone - Número de telefone no formato +5511999999999
   * @param codigo - Código temporário recebido
   * @returns Resposta da API com token e dados do usuário
   */
  async login(telefone: string, codigo: string): Promise<LoginResponse> {
    try {
      console.log("🔐 authService.login chamado");
      console.log("📍 Endpoint:", API_ENDPOINTS.auth.login);
      console.log("📤 Enviando payload:", { telefone, codigo });

      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.auth.login,
        {
          telefone,
          codigo,
        }
      );

      const data = response.data;
      console.log("📥 Resposta recebida:", data);

      // Se login bem-sucedido, salvar dados no localStorage
      if (data.status && data.token && data.usuario) {
        this.saveAuthData({
          token: data.token,
          userName: data.usuario.nome,
          subscription: data.assinatura,
        });
        console.log("✅ Login realizado com sucesso");
      }

      return data;
    } catch (error: any) {
      console.error("❌ Erro capturado no authService.login:", error);
      
      // Se receber erro 400, retornar a resposta de erro
      if (error.response?.status === 400) {
        console.error("❌ Erro 400 - Bad Request:", error.response.data);
        return error.response.data as LoginResponse;
      }

      // Outros erros
      console.error("❌ Erro ao fazer login:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  /**
   * Salvar dados de autenticação no localStorage
   */
  saveAuthData(data: {
    token: string;
    userName: string;
    subscription?: any;
  }): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(STORAGE_KEYS.USER_NAME, data.userName);

    if (data.subscription) {
      localStorage.setItem(
        STORAGE_KEYS.SUBSCRIPTION,
        JSON.stringify(data.subscription)
      );
    }

    // Limpar chaves antigas (telefone e codigoTemp)
    localStorage.removeItem("fenontech-telefone");
    localStorage.removeItem("fenontech-codigoTemp");
    localStorage.removeItem("fenontech-user");

    console.log("✅ Dados de autenticação salvos com sucesso");
  },

  /**
   * Limpar credenciais do localStorage
   */
  clearUserCredentials(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);

    // Limpar chaves antigas também
    localStorage.removeItem("fenontech-telefone");
    localStorage.removeItem("fenontech-codigoTemp");
    localStorage.removeItem("fenontech-user");

    console.log("✅ Credenciais removidas");
  },

  /**
   * Verificar se usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!token;
  },

  /**
   * Obter token de autenticação
   */
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Obter nome do usuário
   */
  getUserName(): string | null {
    return localStorage.getItem(STORAGE_KEYS.USER_NAME);
  },

  /**
   * Atualizar nome do usuário no localStorage
   * @param newName - Novo nome do usuário
   */
  updateUserName(newName: string): void {
    localStorage.setItem(STORAGE_KEYS.USER_NAME, newName);
    console.log("🔄 Nome do usuário atualizado no localStorage:", newName);

    // Disparar evento customizado para notificar componentes sobre a mudança
    window.dispatchEvent(new Event("userNameUpdated"));
  },

  /**
   * Obter dados da assinatura
   */
  getSubscription(): any | null {
    const subscriptionStr = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (!subscriptionStr) return null;

    try {
      return JSON.parse(subscriptionStr);
    } catch (error) {
      console.error("❌ Erro ao parsear dados da assinatura:", error);
      return null;
    }
  },
};
