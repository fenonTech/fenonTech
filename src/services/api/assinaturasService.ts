/**
 * Serviço de Assinaturas
 *
 * Centraliza operações relacionadas às assinaturas do usuário
 */

import apiClient from "../../config/axios.config";
import { API_ENDPOINTS } from "../../config/api.config";

// ========================================
// 📦 TIPOS E INTERFACES
// ========================================

export interface AssinaturaAtual {
  id: number;
  usuarioCodigo: number;
  prazo: string;
  plano_id_cakto: string;
  plano_name_cakto: string;
  subscription_id_cakto: string;
  is_cancelado: boolean;
  created_at: string;
}

export interface AssinaturaHistorico {
  id: number;
  usuarioCodigo: number;
  checkout_id: string;
  nome_assinatura: string;
  dataAssinatura: string;
  prazo: string;
  plano_id_cakto: string;
  is_cancelado: boolean;
  dataCancelamento: string | null;
}

export interface MinhasAssinaturasResponse {
  status: boolean;
  status_code: number;
  assinatura_atual: AssinaturaAtual;
  historico: AssinaturaHistorico[];
}

// ========================================
// 📡 SERVIÇO DE ASSINATURAS
// ========================================

export const assinaturasService = {
  /**
   * Buscar assinatura atual e histórico do usuário
   * @returns Assinatura atual e histórico
   */
  async getMinhasAssinaturas(): Promise<MinhasAssinaturasResponse> {
    try {
      console.log("📥 Buscando assinaturas do usuário...");

      const response = await apiClient.get<MinhasAssinaturasResponse>(
        API_ENDPOINTS.assinaturas.minhas
      );

      const data = response.data;

      if (!data.status) {
        throw new Error("Falha ao buscar assinaturas");
      }

      console.log("✅ Assinaturas carregadas com sucesso");
      return data;
    } catch (error: any) {
      console.error("❌ Erro ao buscar assinaturas:", error);

      // Se for 401 (não autorizado), pode ser token inválido
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      // Se for 404, pode ser que o usuário não tenha assinaturas
      if (error.response?.status === 404) {
        throw new Error("Nenhuma assinatura encontrada.");
      }

      throw new Error("Erro ao carregar assinaturas. Tente novamente.");
    }
  },
};
