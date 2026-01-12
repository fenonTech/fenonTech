/**
 * Serviço Central de Dados Financeiros
 *
 * Centraliza toda a lógica de negócio financeira em um lugar só
 * Serve tanto desktop quanto mobile com os mesmos dados e cálculos
 */

import apiClient from "../../config/axios.config";
import { API_ENDPOINTS } from "../../config/api.config";
import { isDateTodayOrBefore, formatTableDate } from "../../utils/date.utils";

// Interface unificada para transação da API
interface TransacaoAPI {
  codigo: number;
  descricao: string;
  valor: number;
  tipo: string;
  data_pagamento: string;
  is_entrada: boolean;
  created_at: string;
  user_id: number;
}

// Interface unificada para dados financeiros
export interface FinancialData {
  // Valores calculados principais
  saldo: number;
  contasAReceber: number;
  contasAPagar: number;
  totalReceitas: number;
  totalDespesas: number;

  // Dados segregados para receitas
  receitaAtual: number;
  valoresAReceber: number;
  entradas: TransacaoAPI[];

  // Dados segregados para despesas
  despesaAtual: number;
  contasAPagarDespesas: number;
  saidas: TransacaoAPI[];

  // Todas as transações formatadas
  transacoes: Array<{
    id: string;
    date: string;
    description: string;
    category: string;
    value: string;
    type: "entrada" | "saida";
    originalData: TransacaoAPI;
  }>;

  // Últimas transações para mobile
  ultimasTransacoes: Array<{
    id: string;
    tipo: "entrada" | "saida";
    categoria: string;
    valor: number;
    data: string;
  }>;
}

/**
 * Serviço central - busca e processa todos os dados financeiros
 */
class FinancialDataService {
  /**
   * Busca todos os dados financeiros para um período
   * Serve tanto dashboard, receitas, despesas, desktop e mobile
   */
  async getFinancialData(month: number, year: number): Promise<FinancialData> {
    try {
      console.log(`🔄 Carregando dados financeiros: mês=${month}, ano=${year}`);

      // Buscar dados da API
      const response = await apiClient.get(
        `${API_ENDPOINTS.transacoes.list}?mes=${month}&ano=${year}`
      );

      const data = response.data;
      const transacoes: TransacaoAPI[] = data.transacoes || [];

      console.log(`✅ Recebidas ${transacoes.length} transações`);

      // Separar entradas e saídas
      const entradas = transacoes.filter((t) => t.is_entrada);
      const saidas = transacoes.filter((t) => !t.is_entrada);

      // Calcular dados baseado nas regras de negócio unificadas
      const financialData = this.calculateFinancialData(
        transacoes,
        entradas,
        saidas
      );

      console.log("📊 Dados financeiros calculados:", {
        saldo: financialData.saldo.toFixed(2),
        contasAReceber: financialData.contasAReceber.toFixed(2),
        contasAPagar: financialData.contasAPagar.toFixed(2),
        totalReceitas: financialData.totalReceitas.toFixed(2),
        totalDespesas: financialData.totalDespesas.toFixed(2),
      });

      return financialData;
    } catch (error) {
      console.error("❌ Erro ao buscar dados financeiros:", error);
      throw error;
    }
  }

  /**
   * Calcula todos os valores financeiros baseado nas transações
   * Lógica de negócio centralizada e reutilizável
   */
  private calculateFinancialData(
    transacoes: TransacaoAPI[],
    entradas: TransacaoAPI[],
    saidas: TransacaoAPI[]
  ): FinancialData {
    // Cálculos principais
    let saldo = 0;
    let contasAReceber = 0;
    let contasAPagar = 0;
    let totalReceitas = 0;
    let totalDespesas = 0;

    // Receitas
    let receitaAtual = 0;
    let valoresAReceber = 0;

    // Despesas
    let despesaAtual = 0;
    let contasAPagarDespesas = 0;

    // Processar entradas
    entradas.forEach((entrada) => {
      const valor = entrada.valor;
      totalReceitas += valor;

      if (isDateTodayOrBefore(entrada.data_pagamento)) {
        // Entrada já recebida
        receitaAtual += valor;
        saldo += valor;
      } else {
        // Entrada futura
        valoresAReceber += valor;
        contasAReceber += valor;
      }
    });

    // Processar saídas
    saidas.forEach((saida) => {
      const valor = saida.valor;
      totalDespesas += valor;

      if (isDateTodayOrBefore(saida.data_pagamento)) {
        // Despesa já paga
        despesaAtual += valor;
        saldo -= valor;
      } else {
        // Despesa futura
        contasAPagarDespesas += valor;
        contasAPagar += valor;
      }
    });

    // Formatar transações para tabelas
    const transacoesFormatadas = transacoes.map((transacao) => ({
      id: transacao.codigo.toString(),
      date: formatTableDate(transacao.data_pagamento),
      description: transacao.descricao || transacao.tipo,
      category: transacao.tipo,
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(transacao.valor),
      type: transacao.is_entrada ? ("entrada" as const) : ("saida" as const),
      originalData: transacao,
    }));

    // Últimas transações para mobile
    const ultimasTransacoes = transacoes.slice(0, 9).map((t) => ({
      id: t.codigo.toString(),
      tipo: t.is_entrada ? ("entrada" as const) : ("saida" as const),
      categoria: t.tipo || t.descricao || "Sem categoria",
      valor: t.valor,
      data: t.data_pagamento ? formatTableDate(t.data_pagamento) : "--/--",
    }));

    return {
      saldo,
      contasAReceber,
      contasAPagar,
      totalReceitas,
      totalDespesas,
      receitaAtual,
      valoresAReceber,
      entradas,
      despesaAtual,
      contasAPagarDespesas,
      saidas,
      transacoes: transacoesFormatadas,
      ultimasTransacoes,
    };
  }
}

export const financialDataService = new FinancialDataService();
