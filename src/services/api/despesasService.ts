import axiosInstance from "../../config/axios.config";
import { API_ENDPOINTS } from "../../config/api.config";
import { isDateTodayOrBefore } from "../../utils/date.utils";

// Interface para despesa da API
interface DespesaAPI {
  codigo: number;
  descricao: string;
  valor: number;
  tipo: string;
  data_pagamento: string;
  is_entrada: boolean;
  created_at: string;
  user_id: number;
}

// Interface para resposta da API
interface DespesasResponse {
  status: boolean;
  status_code: number;
  quantidade: number;
  despesas: DespesaAPI[];
}

// Interface para dados formatados
export interface DespesasData {
  despesaAtual: number;
  contasAPagar: number;
  totalDespesas: number;
  despesas: DespesaAPI[];
}

/**
 * Service para gerenciar despesas
 */
export const despesasService = {
  /**
   * Buscar despesas por mês e ano
   */
  async getDespesas(mes: number, ano: number): Promise<DespesasData> {
    try {
      const response = await axiosInstance.get<DespesasResponse>(
        API_ENDPOINTS.despesas.list,
        {
          params: { mes, ano },
        }
      );

      const despesas = response.data.despesas || [];
      // Separar despesas por data de pagamento
      let despesaAtual = 0;
      let contasAPagar = 0;

      despesas.forEach((despesa: DespesaAPI) => {
        if (isDateTodayOrBefore(despesa.data_pagamento)) {
          despesaAtual += despesa.valor;
        } else {
          contasAPagar += despesa.valor;
        }
      });

      const totalDespesas = despesaAtual + contasAPagar;

      return {
        despesaAtual,
        contasAPagar,
        totalDespesas,
        despesas,
      };
    } catch (error: any) {
      // Se for 404, retornar dados vazios (não há despesas para o período)
      if (error.response?.status === 404) {
        console.log("ℹ️ Nenhuma despesa encontrada para o período");
        return {
          despesaAtual: 0,
          contasAPagar: 0,
          totalDespesas: 0,
          despesas: [],
        };
      }
      console.error("Erro ao buscar despesas:", error);
      throw error;
    }
  },
};
