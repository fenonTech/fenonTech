/**
 * Serviço de Dashboard
 *
 * Centraliza todas as operações relacionadas ao dashboard
 * Compartilhado entre mobile e desktop
 */

import apiClient from "../../config/axios.config";
import { API_ENDPOINTS } from "../../config/api.config";
import { isDateTodayOrBefore } from "../../utils/date.utils";

// ========================================
// 📦 TIPOS E INTERFACES
// ========================================

export interface TransacaoAPI {
  created_at: string;
  descricao: string;
  valor: number;
  tipo: string;
  user_id: number;
  data_pagamento: string;
  codigo: number;
  is_entrada: boolean;
}

export interface TransacoesResponse {
  status: boolean;
  status_code: number;
  quantidade: number;
  transacoes: TransacaoAPI[];
}

export interface DashboardData {
  saldo: number;
  contasAReceber: number;
  contasAPagar: number;
  totalReceitas: number;
  totalDespesas: number;
  transacoes: TransacaoAPI[];
}

// ========================================
// 📡 SERVIÇO DE DASHBOARD
// ========================================

export const dashboardService = {
  /**
   * Buscar transações do Dashboard por mês e ano
   * @param mes - Mês (1-12)
   * @param ano - Ano (ex: 2026)
   * @returns Dados do dashboard calculados
   */
  async getDashboardData(mes: number, ano: number): Promise<DashboardData> {
    try {
      console.log(`📥 Buscando transações: mês=${mes}, ano=${ano}`);

      const response = await apiClient.get<TransacoesResponse>(
        `${API_ENDPOINTS.transacoes.list}?mes=${mes}&ano=${ano}`
      );

      const data = response.data;
      const transacoes = data.transacoes || [];

      console.log(`✅ Recebidas ${transacoes.length} transações`);

      // Calcular dados baseado nas regras de negócio
      let saldo = 0;
      let contasAReceber = 0;
      let contasAPagar = 0;
      let totalReceitas = 0;
      let totalDespesas = 0;

      transacoes.forEach((t) => {
        const valor = t.valor;
        const isToday = isDateTodayOrBefore(t.data_pagamento);

        if (t.is_entrada) {
          // É uma ENTRADA (receita)
          totalReceitas += valor;

          if (isToday) {
            // Entrada já recebida - conta no saldo
            saldo += valor;
          } else {
            // Entrada futura - conta a receber
            contasAReceber += valor;
          }
        } else {
          // É uma SAÍDA (despesa)
          totalDespesas += valor;

          if (isToday) {
            // Despesa já paga - desconta do saldo
            saldo -= valor;
          } else {
            // Despesa futura - conta a pagar
            contasAPagar += valor;
          }
        }
      });

      const resultado = {
        saldo,
        contasAReceber,
        contasAPagar,
        totalReceitas,
        totalDespesas,
        transacoes,
      };

      console.log("📊 Dashboard calculado:", {
        saldo: saldo.toFixed(2),
        contasAReceber: contasAReceber.toFixed(2),
        contasAPagar: contasAPagar.toFixed(2),
        totalReceitas: totalReceitas.toFixed(2),
        totalDespesas: totalDespesas.toFixed(2),
      });

      return resultado;
    } catch (error: any) {
      // Se for 404, retornar dados vazios (não há transações para o período)
      if (error.response?.status === 404) {
        console.log("ℹ️ Nenhuma transação encontrada para o período");
        return {
          saldo: 0,
          contasAReceber: 0,
          contasAPagar: 0,
          totalReceitas: 0,
          totalDespesas: 0,
          transacoes: [],
        };
      }
      console.error("❌ Erro ao buscar dados do dashboard:", error);
      throw error;
    }
  },
};
