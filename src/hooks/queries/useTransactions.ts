/**
 * Hooks do React Query para Transações
 * Fornece queries e mutations para criar, atualizar e deletar transações
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionApiService } from "../../services/transactionApiService";
import type {
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from "../../services/transactionApiService";

// ========================================
// 📊 QUERIES (Leitura)
// ========================================

/**
 * Hook para buscar receitas
 */
export const useIncomes = () => {
  return useQuery({
    queryKey: ["incomes"],
    queryFn: () => transactionApiService.getIncomes(),
    staleTime: 30000,
  });
};

/**
 * Hook para buscar despesas
 */
export const useExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: () => transactionApiService.getExpenses(),
    staleTime: 30000,
  });
};

// ========================================
// 🔄 MUTATIONS (Escrita com Optimistic Updates)
// ========================================

/**
 * Hook para criar transação (receita ou despesa)
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionDTO) =>
      transactionApiService.createTransaction(data),

    // Optimistic Update: atualiza UI antes da resposta da API
    onMutate: async (newTransaction) => {
      // Cancelar queries em andamento para evitar conflitos
      await queryClient.cancelQueries({ queryKey: ["dashboard"] });

      // Retornar contexto para rollback se necessário
      return { newTransaction };
    },

    // Se der sucesso, invalida cache para refetch
    onSuccess: (_data, variables) => {
      console.log("✅ Transação criada com sucesso!");

      // Invalidar queries relacionadas para recarregar dados
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      if (variables.isIncome) {
        queryClient.invalidateQueries({ queryKey: ["incomes"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
      }
    },

    // Se der erro, pode fazer rollback aqui
    onError: (error) => {
      console.error("❌ Erro ao criar transação:", error);
      // Aqui poderia restaurar o estado anterior se tivesse implementado optimistic update
    },
  });
};

/**
 * Hook para criar receita
 */
export const useCreateIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<CreateTransactionDTO, "isIncome">) =>
      transactionApiService.createIncome(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
  });
};

/**
 * Hook para criar despesa
 */
export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<CreateTransactionDTO, "isIncome">) =>
      transactionApiService.createExpense(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};

/**
 * Hook para atualizar transação
 */
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTransactionDTO) =>
      transactionApiService.updateTransaction(data),

    onMutate: async (updatedTransaction) => {
      await queryClient.cancelQueries({ queryKey: ["dashboard"] });
      return { updatedTransaction };
    },

    onSuccess: (_data, variables) => {
      console.log("✅ Transação atualizada com sucesso!");

      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      if (variables.isIncome) {
        queryClient.invalidateQueries({ queryKey: ["incomes"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
      }
    },

    onError: (error) => {
      console.error("❌ Erro ao atualizar transação:", error);
    },
  });
};

/**
 * Hook para deletar transação
 */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ codigo, isIncome }: { codigo: number; isIncome: boolean }) =>
      transactionApiService.deleteTransaction(codigo, isIncome),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["dashboard"] });
      return variables;
    },

    onSuccess: (_data, variables) => {
      console.log("✅ Transação deletada com sucesso!");

      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      if (variables.isIncome) {
        queryClient.invalidateQueries({ queryKey: ["incomes"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
      }
    },

    onError: (error) => {
      console.error("❌ Erro ao deletar transação:", error);
    },
  });
};
