import React, { useState, useMemo } from "react";
import "./Receitas.css";
import TransactionTable from "../../components/TransactionTable";
import type { TableColumn } from "../../components/TransactionTable";
import PageHeader from "../../components/PageHeader";
import FinancialCardGrid from "../../components/FinancialCardGrid";
import MonthlyBarChart from "../../components/MonthlyBarChart";
import { IncomeModal } from "../../components/Modals";

import { useFilter } from "../../contexts/FilterContext";
import { useBalanceVisibility } from "../../hooks/useBalanceVisibility";
import { useReceitasData } from "../../hooks/queries";
import { transactionsService } from "../../services/api/transactionsService";
import {
  formatCurrency,
  formatTableDate,
  isDateTodayOrBefore,
} from "../../utils";
import sacoDeDinheiro from "../../assets/sacoDeDinheiro.png";
import simboloMeuBolsoContasAReceberCard from "../../assets/simboloMeuBolsoContasAReceberCard.png";

const Receitas: React.FC = () => {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } =
    useFilter();
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { isBalanceVisible, toggleBalanceVisibility, formatValue } =
    useBalanceVisibility();

  // React Query - Busca dados de receitas com cache automático
  const { data: receitasApiData, refetch: refetchReceitas } = useReceitasData(
    selectedMonth + 1, // API usa 1-12, FilterContext usa 0-11
    selectedYear,
  );

  // Extrair dados (com valores padrão)
  const receitaAtual = receitasApiData?.receitaAtual ?? 0;
  const valoresAReceber = receitasApiData?.valoresAReceber ?? 0;
  const entradas = receitasApiData?.entradas ?? [];

  // Preparar dados para as tabelas
  const receitasData = useMemo(() => {
    return entradas
      .filter((entrada) => isDateTodayOrBefore(entrada.data_pagamento))
      .map((entrada) => {
        return {
          id: entrada.codigo.toString(),
          date: formatTableDate(entrada.data_pagamento),
          originalDate: entrada.data_pagamento,
          category: entrada.tipo,
          type: entrada.descricao || "Variável",
          value: formatCurrency(entrada.valor),
          originalData: entrada,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.originalDate).getTime() -
          new Date(a.originalDate).getTime(),
      );
  }, [entradas]);

  const contasAReceberData = useMemo(() => {
    return entradas
      .filter((entrada) => !isDateTodayOrBefore(entrada.data_pagamento))
      .map((entrada) => {
        return {
          id: entrada.codigo.toString(),
          date: formatTableDate(entrada.data_pagamento),
          originalDate: entrada.data_pagamento,
          category: entrada.tipo,
          type: entrada.descricao || "Variável",
          value: formatCurrency(entrada.valor),
          originalData: entrada,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.originalDate).getTime() -
          new Date(a.originalDate).getTime(),
      );
  }, [entradas]);

  // Função para adicionar nova receita/conta a receber
  const handleAddReceita = () => {
    setIsEditMode(false);
    setEditingIncome(null);
    setIsIncomeModalOpen(true);
  };

  // Função para editar receita
  const handleEditIncome = (income: any) => {
    // Transformar dados da API para o formato esperado pelo modal
    const incomeForModal = {
      id: income.originalData.codigo.toString(),
      value: income.originalData.valor,
      category: income.originalData.tipo || income.originalData.descricao || "",
      date: income.originalData.data_pagamento,
      type: "income" as const,
    };
    setEditingIncome(incomeForModal);
    setIsEditMode(true);
    setIsIncomeModalOpen(true);
  };

  // Função para excluir receita
  const handleDeleteIncome = async (income: any) => {
    if (!window.confirm("Tem certeza que deseja excluir esta receita?")) {
      return;
    }

    try {
      await transactionsService.delete(income.originalData.codigo);

      // Recarregar dados após deletar
      await refetchReceitas();

      console.log("✅ Receita deletada com sucesso");
    } catch (error) {
      console.error("❌ Erro ao deletar receita:", error);
      alert("Erro ao deletar receita. Tente novamente.");
    }
  };

  // Função para fechar o modal
  const handleCloseIncomeModal = () => {
    setIsIncomeModalOpen(false);
    setIsEditMode(false);
    setEditingIncome(null);
  };

  // Função para salvar receita
  const handleSaveIncome = async (incomeData: any) => {
    try {
      const payload = {
        valor: incomeData.value,
        is_entrada: true,
        data_pagamento: incomeData.date, // já vem no formato YYYY-MM-DD
        descricao: incomeData.category || "Receita",
        tipo: incomeData.category || "Receita",
      };

      if (isEditMode && editingIncome) {
        // Editar receita existente - usar editingIncome.id que contém o código
        await transactionsService.update(Number(editingIncome.id), payload);
        console.log("✅ Receita atualizada com sucesso");
      } else {
        // Criar nova receita
        await transactionsService.create(payload);
        console.log("✅ Receita criada com sucesso");
      }

      // Recarregar dados
      await refetchReceitas();

      handleCloseIncomeModal();
    } catch (error) {
      console.error("❌ Erro ao salvar receita:", error);
      alert("Erro ao salvar receita. Tente novamente.");
    }
  };

  // Dados para o gráfico de barras - TODO: será implementado posteriormente
  const monthlyData = useMemo(() => {
    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    // Por enquanto, retornar dados vazios
    return months.map((month) => ({
      month,
      value: 0,
    }));
  }, []);

  // Definir colunas para a tabela de receitas
  const receitasColumns: TableColumn[] = [
    { key: "date", label: "Pagamento" },
    {
      key: "type",
      label: "Descrição",
      render: (value) => (
        <span className={`category ${value.toLowerCase()}`}>{value}</span>
      ),
    },
    {
      key: "value",
      label: "Valor",
      render: (value) => <span className="value income">{value}</span>,
    },
  ];

  // Definir colunas para a tabela de Valores a Receber
  const contasAReceberColumns: TableColumn[] = [
    { key: "date", label: "Pagamento" },
    {
      key: "type",
      label: "Descrição",
      render: (value) => (
        <span className={`category ${value.toLowerCase()}`}>{value}</span>
      ),
    },
    {
      key: "value",
      label: "Valor",
      render: (value) => <span className="value income">{value}</span>,
    },
  ];

  return (
    <div className="receitas-page">
      {/* Filtro de Mês e Ano */}
      <PageHeader
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
      />

      {/* Cards principais - DESKTOP */}
      <FinancialCardGrid
        cards={[
          {
            title: "Receita Atual",
            value: formatValue(receitaAtual),
            icon: sacoDeDinheiro,
            type: "positive",
          },
          {
            title: "Valores a Receber",
            value: formatValue(valoresAReceber),
            icon: simboloMeuBolsoContasAReceberCard,
            type: "neutral",
          },
        ]}
        isBalanceVisible={isBalanceVisible}
        onToggleVisibility={toggleBalanceVisibility}
        className="receitas-cards"
      />

      {/* Conteúdo Principal */}
      <div className="receitas-content">
        {/* Primeira linha com tabelas */}
        <div className="receitas-tables-row">
          {/* Últimas Entradas */}
          <TransactionTable
            title="Últimas Entradas"
            columns={receitasColumns}
            data={receitasData}
            className="receitas-table-card"
            showSummary={true}
            summaryCountLabel="Entradas"
            valueKey="value"
            showActions={true}
            onEdit={handleEditIncome}
            onDelete={handleDeleteIncome}
          />

          {/* Valores a Receber */}
          <TransactionTable
            title="Valores a Receber"
            columns={contasAReceberColumns}
            data={contasAReceberData}
            className="receitas-table-card"
            showSummary={true}
            summaryCountLabel="Contas"
            valueKey="value"
            showActions={true}
            onEdit={handleEditIncome}
            onDelete={handleDeleteIncome}
          />
        </div>
      </div>

      {/* Botão Flutuante de Adicionar */}
      <button
        className="floating-add-button"
        onClick={handleAddReceita}
        aria-label="Adicionar nova receita"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Modal de Receitas */}
      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={handleCloseIncomeModal}
        onSave={handleSaveIncome}
        onUpdate={handleSaveIncome}
        onDelete={
          isEditMode && editingIncome
            ? async () => {
                if (
                  !window.confirm(
                    "Tem certeza que deseja excluir esta receita?",
                  )
                ) {
                  return;
                }
                try {
                  await transactionsService.delete(Number(editingIncome.id));
                  await refetchReceitas();
                  handleCloseIncomeModal();
                  console.log("✅ Receita deletada com sucesso");
                } catch (error) {
                  console.error("❌ Erro ao deletar receita:", error);
                  alert("Erro ao deletar receita. Tente novamente.");
                }
              }
            : undefined
        }
        editingIncome={editingIncome}
        mode={isEditMode ? "edit" : "add"}
      />
    </div>
  );
};

export default Receitas;
