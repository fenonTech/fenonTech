/**
 * GUIA DE USO: React Query com Optimistic Updates
 *
 * Este arquivo mostra como usar os hooks do React Query
 * nos seus componentes de receitas e despesas
 */

import { useState } from "react";
import { useCreateIncome, useDeleteTransaction } from "../../hooks";
import IncomeModal from "../../components/Modals/IncomeModal";
import type { Income } from "../../types/transactions";

/**
 * EXEMPLO 1: Usar mutations no componente de Receitas
 */
const ReceitasPageExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔥 React Query Mutation - criar receita
  const createIncomeMutation = useCreateIncome();

  // 🔥 React Query Mutation - deletar transação
  const deleteTransactionMutation = useDeleteTransaction();

  const handleSaveIncome = async (
    income: Omit<Income, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      // ✅ Chama a mutation - React Query cuida do resto!
      await createIncomeMutation.mutateAsync({
        date: income.date,
        category: income.category,
        value: income.value,
      });

      console.log("✅ Receita criada!");
      // Dashboard será atualizado AUTOMATICAMENTE pelo React Query
    } catch (error) {
      console.error("❌ Erro ao criar receita:", error);
      alert("Erro ao criar receita. Tente novamente.");
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      await deleteTransactionMutation.mutateAsync({
        codigo: parseInt(id),
        isIncome: true,
      });

      console.log("✅ Receita deletada!");
      // Dashboard será atualizado AUTOMATICAMENTE
    } catch (error) {
      console.error("❌ Erro ao deletar receita:", error);
      alert("Erro ao deletar receita. Tente novamente.");
    }
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Nova Receita</button>

      <IncomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveIncome}
        onDelete={handleDeleteIncome}
      />

      {/* Estados de loading */}
      {createIncomeMutation.isPending && <div>Salvando receita...</div>}

      {deleteTransactionMutation.isPending && <div>Deletando receita...</div>}
    </div>
  );
};

/**
 * EXEMPLO 2: Usar no Dashboard com invalidação manual
 */
const DashboardButtonExample = () => {
  const createIncomeMutation = useCreateIncome();

  const handleQuickIncome = async () => {
    try {
      await createIncomeMutation.mutateAsync({
        date: new Date().toISOString().split("T")[0],
        category: "Salário",
        value: 5000,
      });

      // ✅ Cache do Dashboard é invalidado automaticamente!
      // ✅ Dados são recarregados em background
      // ✅ UI mostra loading state se necessário

      console.log("Receita adicionada! Dashboard atualizando...");
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <button
      onClick={handleQuickIncome}
      disabled={createIncomeMutation.isPending}
    >
      {createIncomeMutation.isPending ? "Salvando..." : "Adicionar Salário"}
    </button>
  );
};

/**
 * BENEFÍCIOS DO REACT QUERY:
 *
 * ✅ Cache automático (navegação instantânea)
 * ✅ Invalidação automática após mutations
 * ✅ Estados de loading/error padronizados
 * ✅ Retry automático em caso de falha
 * ✅ Background refetching quando volta para aba
 * ✅ Optimistic updates (próximo passo)
 *
 * PERFORMANCE:
 *
 * Antes: Toda navegação = nova chamada API (1s cada)
 * Depois:
 *   - 1ª visita: 1s (normal)
 *   - Volta ao Dashboard: 0ms (cache)
 *   - Muda filtro: 1s, mas mostra dados antigos
 *   - Cria transação: UI atualiza instantaneamente
 */

export { ReceitasPageExample, DashboardButtonExample };
