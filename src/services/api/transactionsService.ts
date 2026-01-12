/**
 * Serviço para gerenciar CRUD de transações (criar, editar, deletar)
 */

import { api } from "../../config";

export interface TransactionCreateDTO {
  valor: number;
  is_entrada: boolean;
  data_pagamento: string; // formato: "YYYY-MM-DD"
  descricao: string;
}

export interface TransactionUpdateDTO {
  valor: number;
  is_entrada: boolean;
  data_pagamento: string; // formato: "YYYY-MM-DD"
  descricao: string;
}

export interface TransactionResponse {
  codigo: number;
  valor: number;
  is_entrada: boolean;
  data_pagamento: string;
  descricao: string;
  created_at: string;
  user_id: number;
  tipo: string | null;
}

/**
 * Criar nova transação
 * POST /api/transacoes
 */
export const createTransaction = async (
  data: TransactionCreateDTO
): Promise<TransactionResponse> => {
  const response = await api.post<TransactionResponse>("/transacoes", data);
  return response.data.data; // ApiResponse.data contém os dados reais
};

/**
 * Atualizar transação existente
 * PUT /api/transacoes/{codigo}
 */
export const updateTransaction = async (
  codigo: number,
  data: TransactionUpdateDTO
): Promise<TransactionResponse> => {
  const response = await api.put<TransactionResponse>(
    `/transacoes/${codigo}`,
    data
  );
  return response.data.data; // ApiResponse.data contém os dados reais
};

/**
 * Deletar transação
 * DELETE /api/transacoes/{codigo}
 */
export const deleteTransaction = async (codigo: number): Promise<void> => {
  await api.delete(`/transacoes/${codigo}`);
};

export const transactionsService = {
  create: createTransaction,
  update: updateTransaction,
  delete: deleteTransaction,
};
