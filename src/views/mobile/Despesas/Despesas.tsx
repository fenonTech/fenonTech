import React, { useState } from "react";
import HeaderMobile from "../../../components/HeaderMobile";
import FinancialCardMobile from "../../../components/FinancialCardMobile";
import { UltimasTransacoesMobile } from "../../../components/UltimasTransacoesMobile";
import { BottomNavigationMobile } from "../../../components/BottomNavigationMobile";
import FloatingActionButton from "../../../components/FloatingActionButton";
import ExpenseModal from "../../../components/Modals/ExpenseModal";
import { CategoryViewMobile } from "../../../components/CategoryViewMobile";
import type { Expense } from "../../../types/transactions";
import type { MobileScreenType } from "../../../components/LayoutMobile";
import { useFilter } from "../../../contexts/FilterContext";
import { useDespesasData } from "../../../hooks/queries";
import { transactionsService } from "../../../services/api/transactionsService";
import { formatCurrency, formatTableDate } from "../../../utils";
import "./Despesas.css";

interface DespesasProps {
  onNavigate?: (screen: MobileScreenType) => void;
  isBalanceVisible?: boolean;
  onToggleVisibility: () => void;
  userName?: string;
  onLogoutClick?: () => void;
}

const Despesas: React.FC<DespesasProps> = ({
  onNavigate,
  isBalanceVisible = true,
  onToggleVisibility,
  userName = "Usuário",
  onLogoutClick,
}) => {
  const { selectedMonth, selectedYear } = useFilter();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // React Query - Busca dados de despesas com cache automático
  const { data: despesasData, refetch: refetchDespesas } = useDespesasData(
    selectedMonth + 1,
    selectedYear
  );

  // Extrair dados (com valores padrão)
  const despesaAtual = despesasData?.despesaAtual ?? 0;
  const contasAPagar = despesasData?.contasAPagar ?? 0;
  const despesas = despesasData?.despesas ?? [];

  const handleConfigClick = () => {
    if (onNavigate) {
      onNavigate("configuracoes");
    }
  };

  const handleLogoutClick = () => {
    if (onLogoutClick) {
      onLogoutClick();
    }
  };

  const handleNavTabChange = (tab: "inicio" | "receitas" | "despesas") => {
    console.log(`Navegar para: ${tab}`);
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  const handleOpenExpenseModal = () => {
    setEditingExpense(null);
    setIsEditMode(false);
    setIsExpenseModalOpen(true);
  };

  const handleCloseExpenseModal = () => {
    setIsExpenseModalOpen(false);
    setEditingExpense(null);
    setIsEditMode(false);
  };

  const handleSaveExpense = async (
    expenseData: Omit<Expense, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const payload = {
        valor: expenseData.value,
        is_entrada: false,
        data_pagamento: expenseData.date,
        descricao: expenseData.category || "Despesa",
        tipo: expenseData.category || "Despesa",
      };

      if (isEditMode && editingExpense) {
        await transactionsService.update(Number(editingExpense.id), payload);
      } else {
        await transactionsService.create(payload);
      }

      // Recarregar dados
      await refetchDespesas();

      handleCloseExpenseModal();
    } catch (error) {
      console.error("❌ Erro ao salvar despesa:", error);
      alert("Erro ao salvar despesa. Tente novamente.");
    }
  };

  const handleUpdateExpense = (expense: Expense) => {
    handleSaveExpense(expense);
  };

  const handleDeleteExpense = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta despesa?")) {
      return;
    }

    try {
      await transactionsService.delete(Number(id));

      // Recarregar dados
      await refetchDespesas();

      handleCloseExpenseModal();
    } catch (error) {
      console.error("❌ Erro ao deletar despesa:", error);
      alert("Erro ao deletar despesa. Tente novamente.");
    }
  };

  const handleEditTransaction = (transacao: any) => {
    // Transformar dados da API para o formato esperado pelo modal
    const expense: Expense = {
      id: transacao.id || transacao.codigo?.toString() || `temp-${Date.now()}`,
      type: "expense" as const,
      category:
        transacao.categoria || transacao.tipo || transacao.descricao || "",
      value:
        typeof transacao.valor === "number"
          ? transacao.valor
          : parseFloat(transacao.valor.toString().replace(",", ".")),
      formattedValue: formatCurrency(transacao.valor),
      description: transacao.descricao || "",
      date:
        transacao.dataOriginal || transacao.data_pagamento
          ? transacao.dataOriginal || transacao.data_pagamento
          : new Date().toISOString().split("T")[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEditingExpense(expense);
    setIsEditMode(true);
    setIsExpenseModalOpen(true);
  };

  // Calcular categorias dinamicamente baseado nas despesas
  const calcularCategorias = () => {
    const categoriasMap = new Map<
      string,
      { valorGasto: number; valorTotal: number }
    >();

    // Processar despesas
    despesas.forEach((despesa) => {
      const categoria = despesa.tipo || despesa.descricao || "Despesa";
      const valor = despesa.valor;

      if (!categoriasMap.has(categoria)) {
        categoriasMap.set(categoria, { valorGasto: 0, valorTotal: 0 });
      }

      const categoriaData = categoriasMap.get(categoria)!;
      categoriaData.valorTotal += valor;

      // Para despesas, consideramos que o "gasto" é o valor já pago
      // (baseado na data de pagamento vs hoje)
      const hoje = new Date();
      const dataPagamento = despesa.data_pagamento
        ? new Date(despesa.data_pagamento)
        : new Date();
      if (dataPagamento <= hoje) {
        categoriaData.valorGasto += valor;
      }
    });

    // Converter para array e ordenar por valor total
    return Array.from(categoriasMap.entries())
      .map(([nome, dados]) => ({
        nome,
        valorGasto: dados.valorGasto,
        valorTotal: dados.valorTotal,
      }))
      .sort((a, b) => b.valorTotal - a.valorTotal);
  };

  const categoriasDinamicas = calcularCategorias();
  const despesasTransacoes = despesas.map((despesa) => ({
    id: despesa.codigo.toString(),
    tipo: "saida" as const,
    categoria: despesa.tipo || despesa.descricao || "Despesa",
    valor: despesa.valor,
    data: despesa.data_pagamento
      ? formatTableDate(despesa.data_pagamento)
      : "--/--",
    dataOriginal: despesa.data_pagamento, // Data original para filtro
    codigo: despesa.codigo,
  }));

  return (
    <div className="mobile-screen-container">
      <HeaderMobile
        userName={userName}
        onConfigClick={handleConfigClick}
        onLogoutClick={handleLogoutClick}
      />
      <div className="mobile-screen-content">
        <FinancialCardMobile
          receitas={0}
          despesas={despesaAtual}
          contasPagar={contasAPagar}
          contasReceber={0}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={onToggleVisibility}
          mesAno={`${String(selectedMonth + 1).padStart(
            2,
            "0"
          )}/${selectedYear}`}
          mode="despesas"
          onNavigate={handleNavTabChange}
        />
        <UltimasTransacoesMobile
          transacoes={despesasTransacoes}
          showFooter={true}
          totalTransacoes={despesasTransacoes.length}
          valorTotal={despesaAtual}
          isBalanceVisible={isBalanceVisible}
          onEditTransaction={handleEditTransaction}
        />
        <CategoryViewMobile categorias={categoriasDinamicas} />
      </div>

      <BottomNavigationMobile
        activeTab="despesas"
        onTabChange={handleNavTabChange}
      />

      <FloatingActionButton
        onClick={handleOpenExpenseModal}
        icon="plus"
        color="primary"
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={handleCloseExpenseModal}
        onSave={handleSaveExpense}
        onUpdate={handleUpdateExpense}
        onDelete={handleDeleteExpense}
        editingExpense={editingExpense}
        mode={isEditMode ? "edit" : "add"}
      />
    </div>
  );
};

export default Despesas;
