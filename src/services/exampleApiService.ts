/**
 * Exemplo de serviço usando a API configurada
 * Use este modelo para criar serviços específicos para cada módulo
 */

import { api, API_ENDPOINTS } from "../config";

// Exemplo de tipos (ajuste conforme a resposta real da sua API)
export interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  value: number;
  date: string;
  description?: string;
}

/**
 * Serviço de exemplo para transações
 */
export const exampleApiService = {
  // GET - Listar todas as transações
  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const response = await api.get<Transaction[]>(
        API_ENDPOINTS.transactions.list
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      throw error;
    }
  },

  // POST - Criar uma nova transação
  async createTransaction(
    transaction: Omit<Transaction, "id">
  ): Promise<Transaction> {
    try {
      const response = await api.post<Transaction>(
        API_ENDPOINTS.transactions.create,
        transaction
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      throw error;
    }
  },

  // PUT - Atualizar uma transação
  async updateTransaction(
    id: string,
    transaction: Partial<Transaction>
  ): Promise<Transaction> {
    try {
      const response = await api.put<Transaction>(
        API_ENDPOINTS.transactions.update(id),
        transaction
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      throw error;
    }
  },

  // DELETE - Deletar uma transação
  async deleteTransaction(id: string): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.transactions.delete(id));
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      throw error;
    }
  },
};

/**
 * EXEMPLO DE USO EM UM COMPONENTE:
 *
 * import { exampleApiService } from '../services/exampleApiService';
 *
 * // Dentro de um componente ou função
 * const fetchData = async () => {
 *   try {
 *     const transactions = await exampleApiService.getAllTransactions();
 *     console.log('Transações:', transactions);
 *   } catch (error) {
 *     console.error('Erro:', error);
 *   }
 * };
 *
 * // Criar nova transação
 * const newTransaction = {
 *   type: 'income',
 *   category: 'Salário',
 *   value: 5000,
 *   date: '2025-11-25',
 *   description: 'Salário mensal'
 * };
 *
 * await exampleApiService.createTransaction(newTransaction);
 */
