import React, { useState } from "react";
import HeaderMobile from "../../../components/HeaderMobile";
import FinancialCardMobile from "../../../components/FinancialCardMobile";
import { UltimasTransacoesMobile } from "../../../components/UltimasTransacoesMobile";
import { BottomNavigationMobile } from "../../../components/BottomNavigationMobile";
import FloatingActionButton from "../../../components/FloatingActionButton";
import IncomeModal from "../../../components/Modals/IncomeModal";
import { CategoryViewMobile } from "../../../components/CategoryViewMobile";
import type { Income } from "../../../types/transactions";
import type { MobileScreenType } from "../../../components/LayoutMobile";
import "./Receitas.css";

interface ReceitasProps {
  onNavigate?: (screen: MobileScreenType) => void;
  isBalanceVisible?: boolean;
  onToggleVisibility: () => void;
}

const Receitas: React.FC<ReceitasProps> = ({
  onNavigate,
  isBalanceVisible = true,
  onToggleVisibility,
}) => {
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
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

  const handleOpenIncomeModal = () => {
    setEditingIncome(null);
    setIsIncomeModalOpen(true);
  };

  const handleCloseIncomeModal = () => {
    setIsIncomeModalOpen(false);
    setEditingIncome(null);
  };

  const handleSaveIncome = (
    incomeData: Omit<Income, "id" | "createdAt" | "updatedAt">
  ) => {
    console.log("Nova receita:", incomeData);
    // TODO: Implementar salvamento da receita
    handleCloseIncomeModal();
  };

  const handleUpdateIncome = (income: Income) => {
    console.log("Editando receita:", income);
    // TODO: Implementar edição da receita
    handleCloseIncomeModal();
  };

  const handleDeleteIncome = (id: string) => {
    console.log("Excluindo receita ID:", id);
    // TODO: Implementar exclusão da receita
    handleCloseIncomeModal();
  };

  const handleEditTransaction = (transacao: any) => {
    // Converte a transação para o formato Income
    const income: Income = {
      id: transacao.id || `temp-${Date.now()}`,
      type: "income" as const,
      category: transacao.categoria,
      value: parseFloat(transacao.valor.toString().replace(",", ".")),
      formattedValue: transacao.valor.toString(),
      description: transacao.descricao || "",
      date: transacao.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEditingIncome(income);
    setIsIncomeModalOpen(true);
  };

  // Dados de exemplo para receitas
  const receitasTransacoes = [
    {
      id: "1",
      tipo: "entrada" as const,
      categoria: "Salário",
      valor: 5000.0,
      data: "2025-10-31",
    },
    {
      id: "2",
      tipo: "entrada" as const,
      categoria: "Freelance",
      valor: 1500.0,
      data: "2025-10-30",
    },
    {
      id: "3",
      tipo: "entrada" as const,
      categoria: "Investimentos",
      valor: 300.0,
      data: "2025-10-29",
    },
    {
      id: "4",
      tipo: "entrada" as const,
      categoria: "Vendas",
      valor: 800.0,
      data: "2025-10-28",
    },
    {
      id: "4",
      tipo: "entrada" as const,
      categoria: "Vendas",
      valor: 800.0,
      data: "2025-10-28",
    },
    {
      id: "4",
      tipo: "entrada" as const,
      categoria: "Vendas",
      valor: 800.0,
      data: "2025-10-28",
    },
    {
      id: "4",
      tipo: "entrada" as const,
      categoria: "Vendas",
      valor: 800.0,
      data: "2025-10-28",
    },
    {
      id: "4",
      tipo: "entrada" as const,
      categoria: "Vendas",
      valor: 800.0,
      data: "2025-10-28",
    },
    {
      id: "4",
      tipo: "entrada" as const,
      categoria: "Vendas",
      valor: 800.0,
      data: "2025-10-28",
    },
    {
      id: "4",
      tipo: "entrada" as const,
      categoria: "Vendas",
      valor: 800.0,
      data: "2025-10-28",
    },
  ];

  const totalReceitas = receitasTransacoes.reduce(
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
          receitas={totalReceitas}
          despesas={0}
          contasPagar={0}
          contasReceber={2300.0}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={onToggleVisibility}
          mesAno="OUT/2025"
          mode="receitas"
          onNavigate={handleNavTabChange}
        />
        <UltimasTransacoesMobile
          transacoes={receitasTransacoes}
          showFooter={true}
          totalTransacoes={receitasTransacoes.length}
          valorTotal={totalReceitas}
          isBalanceVisible={isBalanceVisible}
          onEditTransaction={handleEditTransaction}
        />
        <CategoryViewMobile
          categorias={[
            { nome: "Salário", valorGasto: 5000, valorTotal: 5000 },
            { nome: "Freelance", valorGasto: 800, valorTotal: 1500 },
            { nome: "Investimentos", valorGasto: 300, valorTotal: 500 },
            { nome: "Vendas", valorGasto: 200, valorTotal: 1000 },
          ]}
        />
      </div>

      <BottomNavigationMobile
        activeTab="receitas"
        onTabChange={handleNavTabChange}
      />

      <FloatingActionButton
        onClick={handleOpenIncomeModal}
        icon="plus"
        color="primary"
      />

      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={handleCloseIncomeModal}
        onSave={handleSaveIncome}
        onUpdate={handleUpdateIncome}
        onDelete={handleDeleteIncome}
        editingIncome={editingIncome}
        mode={editingIncome ? "edit" : "add"}
      />
    </div>
  );
};

export default Receitas;
