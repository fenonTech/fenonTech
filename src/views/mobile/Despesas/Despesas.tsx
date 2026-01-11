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
import "./Despesas.css";

interface DespesasProps {
  onNavigate?: (screen: MobileScreenType) => void;
  isBalanceVisible?: boolean;
  onToggleVisibility: () => void;
}

const Despesas: React.FC<DespesasProps> = ({
  onNavigate,
  isBalanceVisible = true,
  onToggleVisibility,
}) => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const handleConfigClick = () => {
    if (onNavigate) {
      onNavigate("configuracoes");
    }
  };

  const handleLogoutClick = () => {
    console.log("Fazer logout");
    // TODO: Implementar logout
  };

  const handleNavTabChange = (tab: "inicio" | "receitas" | "despesas") => {
    console.log(`Navegar para: ${tab}`);
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  const handleOpenExpenseModal = () => {
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  };

  const handleCloseExpenseModal = () => {
    setIsExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const handleSaveExpense = (
    expenseData: Omit<Expense, "id" | "createdAt" | "updatedAt">
  ) => {
    console.log("Nova despesa:", expenseData);
    // TODO: Implementar salvamento da despesa
    handleCloseExpenseModal();
  };

  const handleUpdateExpense = (expense: Expense) => {
    console.log("Editando despesa:", expense);
    // TODO: Implementar edição da despesa
    handleCloseExpenseModal();
  };

  const handleDeleteExpense = (id: string) => {
    console.log("Excluindo despesa ID:", id);
    // TODO: Implementar exclusão da despesa
    handleCloseExpenseModal();
  };

  const handleEditTransaction = (transacao: any) => {
    // Converte a transação para o formato Expense
    const expense: Expense = {
      id: transacao.id || `temp-${Date.now()}`,
      type: "expense" as const,
      category: transacao.categoria,
      value: parseFloat(transacao.valor.toString().replace(",", ".")),
      formattedValue: transacao.valor.toString(),
      description: transacao.descricao || "",
      date: transacao.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  // Dados de exemplo para despesas
  const despesasTransacoes = [
    {
      id: "d1",
      tipo: "saida" as const,
      categoria: "Alimentação",
      valor: 250.0,
      data: "2025-10-31",
    },
    {
      id: "d2",
      tipo: "saida" as const,
      categoria: "Transporte",
      valor: 120.0,
      data: "2025-10-30",
    },
    {
      id: "d3",
      tipo: "saida" as const,
      categoria: "Lazer",
      valor: 80.0,
      data: "2025-10-29",
    },
    {
      id: "d4",
      tipo: "saida" as const,
      categoria: "Compras",
      valor: 350.0,
      data: "2025-10-28",
    },
  ];

  const totalDespesas = despesasTransacoes.reduce(
    (total, transacao) => total + transacao.valor,
    0
  );

  return (
    <div className="mobile-screen-container">
      <HeaderMobile
        userName="Gustavo Lindão"
        onConfigClick={handleConfigClick}
        onLogoutClick={handleLogoutClick}
      />
      <div className="mobile-screen-content">
        <FinancialCardMobile
          receitas={0}
          despesas={totalDespesas}
          contasPagar={totalDespesas}
          contasReceber={0}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={onToggleVisibility}
          mesAno="OUT/2025"
          mode="despesas"
          onNavigate={handleNavTabChange}
        />
        <UltimasTransacoesMobile
          transacoes={despesasTransacoes}
          showFooter={true}
          totalTransacoes={despesasTransacoes.length}
          valorTotal={totalDespesas}
          isBalanceVisible={isBalanceVisible}
          onEditTransaction={handleEditTransaction}
        />
        <CategoryViewMobile
          categorias={[
            { nome: "Ifood", valorGasto: 40, valorTotal: 100 },
            { nome: "Uber", valorGasto: 10, valorTotal: 85 },
            { nome: "Roupas", valorGasto: 5, valorTotal: 80 },
            { nome: "Despesas Fixas", valorGasto: 0, valorTotal: 100 },
            { nome: "Contas Variaveis", valorGasto: 0, valorTotal: 100 },
          ]}
        />
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
        mode={editingExpense ? "edit" : "add"}
      />
    </div>
  );
};

export default Despesas;
