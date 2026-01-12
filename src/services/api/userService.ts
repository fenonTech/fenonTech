/**
 * Serviço de Usuário
 *
 * Centraliza operações relacionadas aos dados do usuário
 */

import apiClient from "../../config/axios.config";
import { API_ENDPOINTS } from "../../config/api.config";

// ========================================
// 📦 TIPOS E INTERFACES
// ========================================

export interface Usuario {
  nome: string;
  telefone: string;
  email: string;
}

export interface UsuarioResponse {
  status: boolean;
  status_code: number;
  usuario: Usuario;
}

// ========================================
// 📡 SERVIÇO DE USUÁRIO
// ========================================

export const userService = {
  /**
   * Buscar dados do usuário logado
   * Usa o token do localStorage automaticamente via axios interceptor
   * @returns Dados do usuário
   */
  async getMe(): Promise<Usuario> {
    try {
      console.log("📥 Buscando dados do usuário logado...");

      const response = await apiClient.get<UsuarioResponse>(
        API_ENDPOINTS.usuarios.me
      );

      const data = response.data;

      if (!data.status) {
        throw new Error("Falha ao buscar dados do usuário");
      }

      console.log("✅ Dados do usuário carregados com sucesso");
      return data.usuario;
    } catch (error: any) {
      console.error("❌ Erro ao buscar dados do usuário:", error);

      // Se for 401 (não autorizado), pode ser token inválido
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      throw new Error("Erro ao carregar dados do usuário. Tente novamente.");
    }
  },

  /**
   * Atualizar dados do usuário
   * @param userData - Dados a serem atualizados
   * @returns Dados atualizados do usuário
   */
  async updateMe(userData: Partial<Usuario>): Promise<Usuario> {
    try {
      console.log("📤 Atualizando dados do usuário...");

      const response = await apiClient.put<UsuarioResponse>(
        API_ENDPOINTS.usuarios.me,
        userData
      );

      const data = response.data;

      if (!data.status) {
        throw new Error("Falha ao atualizar dados do usuário");
      }

      console.log("✅ Dados do usuário atualizados com sucesso");
      return data.usuario;
    } catch (error: any) {
      console.error("❌ Erro ao atualizar dados do usuário:", error);

      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      throw new Error("Erro ao atualizar dados do usuário. Tente novamente.");
    }
  },

  /**
   * Atualizar perfil do usuário (especificamente para a tela de atualização cadastral)
   * @param profileData - Dados do perfil a serem atualizados (ex: {nome: "Novo Nome"})
   * @returns Dados atualizados do usuário
   */
  async updateProfile(profileData: Partial<Usuario>): Promise<Usuario> {
    try {
      console.log("📤 Atualizando perfil do usuário...", profileData);

      const response = await apiClient.put<UsuarioResponse>(
        API_ENDPOINTS.usuarios.perfil,
        profileData
      );

      const data = response.data;

      if (!data.status) {
        throw new Error("Falha ao atualizar perfil do usuário");
      }

      console.log("✅ Perfil do usuário atualizado com sucesso");
      return data.usuario;
    } catch (error: any) {
      console.error("❌ Erro ao atualizar perfil do usuário:", error);

      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      throw new Error("Erro ao atualizar perfil. Tente novamente.");
    }
  },
};
