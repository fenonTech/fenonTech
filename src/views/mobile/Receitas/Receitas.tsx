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
import { useFilter } from "../../../contexts/FilterContext";
import { useReceitasData } from "../../../hooks/queries";
import { transactionsService } from "../../../services/api/transactionsService";
import { formatCurrency, formatTableDate } from "../../../utils";
import "./Receitas.css";

interface ReceitasProps {
  onNavigate?: (screen: MobileScreenType) => void;
  isBalanceVisible?: boolean;
  onToggleVisibility: () => void;
  userName?: string;
  onLogoutClick?: () => void;
}

const Receitas: React.FC<ReceitasProps> = ({
  onNavigate,
  isBalanceVisible = true,
  onToggleVisibility,
  userName = "Usuário",
  onLogoutClick,
}) => {
  const { selectedMonth, selectedYear } = useFilter();
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // React Query - Busca dados de receitas com cache automático
  const { data: receitasData, refetch: refetchReceitas } = useReceitasData(
    selectedMonth + 1,
    selectedYear,
  );

  // Extrair dados (com valores padrão)
  const receitaAtual = receitasData?.receitaAtual ?? 0;
  const valoresAReceber = receitasData?.valoresAReceber ?? 0;
  const entradas = receitasData?.entradas ?? [];

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

  const handleOpenIncomeModal = () => {
    setEditingIncome(null);
    setIsEditMode(false);
    setIsIncomeModalOpen(true);
  };

  const handleCloseIncomeModal = () => {
    setIsIncomeModalOpen(false);
    setEditingIncome(null);
    setIsEditMode(false);
  };

  const handleSaveIncome = async (
    incomeData: Omit<Income, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      const payload = {
        valor: incomeData.value,
        is_entrada: true,
        data_pagamento: incomeData.date,
        descricao: incomeData.category || "Receita",
        tipo: incomeData.category || "Receita",
      };

      if (isEditMode && editingIncome) {
        await transactionsService.update(Number(editingIncome.id), payload);
      } else {
        await transactionsService.create(payload);
      }

      // Recarregar dados
      await refetchReceitas();

      handleCloseIncomeModal();
    } catch (error) {
      console.error("❌ Erro ao salvar receita:", error);
      alert("Erro ao salvar receita. Tente novamente.");
    }
  };

  const handleUpdateIncome = (income: Income) => {
    handleSaveIncome(income);
  };

  const handleDeleteIncome = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta receita?")) {
      return;
    }

    try {
      await transactionsService.delete(Number(id));

      // Recarregar dados
      await refetchReceitas();

      handleCloseIncomeModal();
    } catch (error) {
      console.error("❌ Erro ao deletar receita:", error);
      alert("Erro ao deletar receita. Tente novamente.");
    }
  };

  const handleEditTransaction = (transacao: any) => {
    // Transformar dados da API para o formato esperado pelo modal
    const income: Income = {
      id: transacao.id || transacao.codigo?.toString() || `temp-${Date.now()}`,
      type: "income" as const,
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
    setEditingIncome(income);
    setIsEditMode(true);
    setIsIncomeModalOpen(true);
  };

  // Calcular categorias dinamicamente baseado nas receitas
  const calcularCategorias = () => {
    const categoriasMap = new Map<
      string,
      { valorGasto: number; valorTotal: number }
    >();

    // Processar receitas (entradas)
    entradas.forEach((entrada) => {
      const categoria = entrada.tipo || "Receita";
      const valor = entrada.valor;

      if (!categoriasMap.has(categoria)) {
        categoriasMap.set(categoria, { valorGasto: 0, valorTotal: 0 });
      }

      const categoriaData = categoriasMap.get(categoria)!;
      categoriaData.valorTotal += valor;

      // Para receitas, consideramos que o "gasto" é o valor atual recebido
      // (baseado na data de pagamento vs hoje)
      const hoje = new Date();
      const dataPagamento = entrada.data_pagamento
        ? new Date(entrada.data_pagamento)
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
  const receitasTransacoes = entradas.map((entrada) => ({
    id: entrada.codigo.toString(),
    tipo: "entrada" as const,
    categoria: entrada.descricao || "Sem descrição",
    valor: entrada.valor,
    data: entrada.data_pagamento
      ? formatTableDate(entrada.data_pagamento)
      : "--/--",
    dataOriginal: entrada.data_pagamento, // Data original para filtro
    codigo: entrada.codigo,
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
          receitas={receitaAtual}
          despesas={0}
          contasPagar={0}
          contasReceber={valoresAReceber}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={onToggleVisibility}
          mesAno={`${String(selectedMonth + 1).padStart(
            2,
            "0",
          )}/${selectedYear}`}
          mode="receitas"
          onNavigate={handleNavTabChange}
        />
        <UltimasTransacoesMobile
          transacoes={receitasTransacoes}
          showFooter={true}
          totalTransacoes={receitasTransacoes.length}
          valorTotal={receitaAtual}
          isBalanceVisible={isBalanceVisible}
          onEditTransaction={handleEditTransaction}
        />
        <CategoryViewMobile categorias={categoriasDinamicas} />
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
        mode={isEditMode ? "edit" : "add"}
      />
    </div>
  );
};

export default Receitas;
