/**
 * Serviço de Receitas (Entradas)
 *
 * Centraliza todas as operações relacionadas a receitas/entradas
 * Compartilhado entre mobile e desktop
 */

import apiClient from "../../config/axios.config";
import { API_ENDPOINTS } from "../../config/api.config";
import { isDateTodayOrBefore } from "../../utils/date.utils";

// ========================================
// 📦 TIPOS E INTERFACES
// ========================================

export interface EntradaAPI {
  created_at: string;
  descricao: string;
  valor: number;
  tipo: string;
  user_id: number;
  data_pagamento: string;
  codigo: number;
  is_entrada: boolean;
}

export interface EntradasResponse {
  status: boolean;
  status_code: number;
  quantidade: number;
  entradas: EntradaAPI[];
}

export interface ReceitasData {
  receitaAtual: number;
  valoresAReceber: number;
  totalReceitas: number;
  entradas: EntradaAPI[];
}

// ========================================
// 📡 SERVIÇO DE RECEITAS
// ========================================

export const receitasService = {
  /**
   * Buscar receitas (entradas) por mês e ano
   * @param mes - Mês (1-12)
   * @param ano - Ano (ex: 2025)
   * @returns Dados de receitas calculados
   */
  async getReceitas(mes: number, ano: number): Promise<ReceitasData> {
    try {
      console.log(`📥 Buscando receitas: mês=${mes}, ano=${ano}`);

      const response = await apiClient.get<EntradasResponse>(
        `${API_ENDPOINTS.entradas.list}?mes=${mes}&ano=${ano}`
      );

      const data = response.data;
      const entradas = data.entradas || [];

      console.log(`✅ Recebidas ${entradas.length} receitas`);

      // Calcular dados baseado nas regras de negócio
      let receitaAtual = 0;
      let valoresAReceber = 0;
      let totalReceitas = 0;

      entradas.forEach((entrada) => {
        const valor = entrada.valor;

        totalReceitas += valor;

        if (isDateTodayOrBefore(entrada.data_pagamento)) {
          // Receita já recebida (data de hoje para trás)
          receitaAtual += valor;
        } else {
          // Receita futura (data maior que hoje) - valor a receber
          valoresAReceber += valor;
        }
      });

      const resultado = {
        receitaAtual,
        valoresAReceber,
        totalReceitas,
        entradas,
      };

      console.log("💰 Receitas calculadas:", {
        receitaAtual: receitaAtual.toFixed(2),
        valoresAReceber: valoresAReceber.toFixed(2),
        totalReceitas: totalReceitas.toFixed(2),
      });

      return resultado;
    } catch (error: any) {
      // Se for 404, retornar dados vazios (não há entradas para o período)
      if (error.response?.status === 404) {
        console.log("ℹ️ Nenhuma receita encontrada para o período");
        return {
          receitaAtual: 0,
          valoresAReceber: 0,
          totalReceitas: 0,
          entradas: [],
        };
      }
      console.error("❌ Erro ao buscar receitas:", error);
      throw error;
    }
  },
};
