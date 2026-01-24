import React, { useState, useMemo, useEffect } from "react";
import "./Despesas.css";
import TransactionTable from "../../components/TransactionTable";
import type { TableColumn } from "../../components/TransactionTable";
import ExpensesPieChart from "../../components/ExpensesPieChart";
import PageHeader from "../../components/PageHeader";
import FinancialCardGrid from "../../components/FinancialCardGrid";
import CategoryBudgetCard from "../../components/CategoryBudgetCard";
import MonthlyBarChart from "../../components/MonthlyBarChart";
import { ExpenseModal } from "../../components/Modals";

import { useFilter } from "../../contexts/FilterContext";
import { useBalanceVisibility } from "../../hooks/useBalanceVisibility";
import { useDespesasData } from "../../hooks/queries";
import { transactionsService } from "../../services/api/transactionsService";
import { despesasService } from "../../services/api/despesasService";
import {
  formatCurrency,
  formatTableDate,
  isDateTodayOrBefore,
} from "../../utils";
import carteiraCardDespesasdoMês from "../../assets/carteiraCardDespesasdoMês.png";
import simboloMenuBolsoContasAPagar from "../../assets/simboloMenuBolsoContasAPagar.png";

const Despesas: React.FC = () => {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } =
    useFilter();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { isBalanceVisible, toggleBalanceVisibility, formatValue } =
    useBalanceVisibility();

  // React Query - Busca dados de despesas com cache automático
  const { data: despesasApiData, refetch: refetchDespesas } = useDespesasData(
    selectedMonth + 1, // API usa 1-12, FilterContext usa 0-11
    selectedYear,
  );

  // Extrair dados (com valores padrão)
  const despesaAtual = despesasApiData?.despesaAtual ?? 0;
  const contasAPagar = despesasApiData?.contasAPagar ?? 0;
  const despesas = despesasApiData?.despesas ?? [];

  // Estado para despesas mensais (gráfico anual)
  const [despesasMensais, setDespesasMensais] = React.useState<{
    [key: number]: number;
  }>({});

  // Carregar despesas de todos os meses do ano para o gráfico
  useEffect(() => {
    const loadYearlyExpenses = async () => {
      try {
        const monthlyTotals: { [key: number]: number } = {};

        // Buscar dados de todos os 12 meses do ano selecionado
        for (let mes = 1; mes <= 12; mes++) {
          try {
            const data = await despesasService.getDespesas(mes, selectedYear);
            monthlyTotals[mes] = data.despesaAtual;
          } catch (error) {
            console.warn(`Erro ao carregar despesas do mês ${mes}:`, error);
            monthlyTotals[mes] = 0;
          }
        }

        setDespesasMensais(monthlyTotals);
        console.log("✅ Despesas anuais carregadas com sucesso");
      } catch (error) {
        console.error("❌ Erro ao carregar despesas anuais:", error);
      }
    };

    loadYearlyExpenses();
  }, [selectedYear]); // Recarregar quando o ano mudar

  // Preparar dados para as tabelas
  const despesasData = useMemo(() => {
    return despesas
      .filter((despesa) => isDateTodayOrBefore(despesa.data_pagamento))
      .map((despesa) => {
        return {
          id: despesa.codigo.toString(),
          date: formatTableDate(despesa.data_pagamento),
          originalDate: despesa.data_pagamento,
          category: despesa.tipo,
          type: despesa.descricao || "Variável",
          value: formatCurrency(despesa.valor),
          originalData: despesa,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.originalDate).getTime() -
          new Date(a.originalDate).getTime(),
      );
  }, [despesas]);

  const contasAPagarData = useMemo(() => {
    return despesas
      .filter((despesa) => !isDateTodayOrBefore(despesa.data_pagamento))
      .map((despesa) => {
        return {
          id: despesa.codigo.toString(),
          date: formatTableDate(despesa.data_pagamento),
          originalDate: despesa.data_pagamento,
          category: despesa.tipo,
          type: despesa.descricao || "Variável",
          value: formatCurrency(despesa.valor),
          originalData: despesa,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.originalDate).getTime() -
          new Date(a.originalDate).getTime(),
      );
  }, [despesas]);

  // Função para adicionar nova despesa/conta a pagar
  const handleAddDespesa = () => {
    setIsEditMode(false);
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  };

  // Função para editar despesa
  const handleEditExpense = (expense: any) => {
    // Transformar dados da API para o formato esperado pelo modal
    const expenseForModal = {
      id: expense.originalData.codigo.toString(),
      value: expense.originalData.valor,
      category:
        expense.originalData.tipo || expense.originalData.descricao || "",
      date: expense.originalData.data_pagamento,
      type: "expense" as const,
    };
    setEditingExpense(expenseForModal);
    setIsEditMode(true);
    setIsExpenseModalOpen(true);
  };

  // Função para excluir despesa
  const handleDeleteExpense = async (expense: any) => {
    if (!window.confirm("Tem certeza que deseja excluir esta despesa?")) {
      return;
    }

    try {
      await transactionsService.delete(expense.originalData.codigo);

      // Recarregar dados após deletar
      await refetchDespesas();

      console.log("✅ Despesa deletada com sucesso");
    } catch (error) {
      console.error("❌ Erro ao deletar despesa:", error);
      alert("Erro ao deletar despesa. Tente novamente.");
    }
  };

  // Função para fechar o modal
  const handleCloseExpenseModal = () => {
    setIsExpenseModalOpen(false);
    setIsEditMode(false);
    setEditingExpense(null);
  };

  // Função para salvar despesa
  const handleSaveExpense = async (expenseData: any) => {
    try {
      const payload = {
        valor: expenseData.value,
        is_entrada: false,
        data_pagamento: expenseData.date, // já vem no formato YYYY-MM-DD
        descricao: expenseData.category || "Despesa",
        tipo: expenseData.category || "Despesa",
      };

      if (isEditMode && editingExpense) {
        // Editar despesa existente - usar editingExpense.id que contém o código
        await transactionsService.update(Number(editingExpense.id), payload);
        console.log("✅ Despesa atualizada com sucesso");
      } else {
        // Criar nova despesa
        await transactionsService.create(payload);
        console.log("✅ Despesa criada com sucesso");
      }

      // Recarregar dados
      await refetchDespesas();

      handleCloseExpenseModal();
    } catch (error) {
      console.error("❌ Erro ao salvar despesa:", error);
      alert("Erro ao salvar despesa. Tente novamente.");
    }
  };

  // Agrupar despesas por categoria para o gráfico de pizza
  const pieChartData = useMemo(() => {
    // Cores pré-definidas para categorias conhecidas
    const categoryColors: { [key: string]: string } = {
      alimentação: "#FF6B6B",
      transporte: "#4ECDC4",
      moradia: "#45B7D1",
      lazer: "#96CEB4",
      saúde: "#FFEAA7",
      educação: "#DDA0DD",
      mercado: "#98D8C8",
      outros: "#B0BEC5",
    };

    // Cores extras para categorias dinâmicas
    const extraColors = [
      "#E74C3C",
      "#3498DB",
      "#2ECC71",
      "#F39C12",
      "#9B59B6",
      "#1ABC9C",
      "#E67E22",
      "#34495E",
    ];

    if (despesas.length === 0) {
      return [];
    }

    // Agrupar despesas por categoria (apenas despesas já pagas)
    const categoryTotals: { [key: string]: number } = {};
    despesas.forEach((despesa) => {
      if (isDateTodayOrBefore(despesa.data_pagamento)) {
        // Usar descricao ou tipo como categoria
        const category = (despesa.descricao || despesa.tipo || "outros")
          .toLowerCase()
          .trim();
        categoryTotals[category] =
          (categoryTotals[category] || 0) + despesa.valor;
      }
    });

    const totalExpenseValue = Object.values(categoryTotals).reduce(
      (sum, value) => sum + value,
      0,
    );

    if (totalExpenseValue === 0) {
      return [];
    }

    // Criar array com todas as categorias encontradas
    let colorIndex = 0;
    return Object.entries(categoryTotals)
      .map(([category, value]) => {
        // Usar cor pré-definida ou cor extra
        let color = categoryColors[category];
        if (!color) {
          color = extraColors[colorIndex % extraColors.length];
          colorIndex++;
        }

        return {
          name: category.charAt(0).toUpperCase() + category.slice(1),
          percentage: Math.round((value / totalExpenseValue) * 100),
          color: color,
        };
      })
      .filter((cat) => cat.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage);
  }, [despesas]);

  // Dados para o gráfico de barras mensais
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

    return months.map((month, index) => ({
      month,
      value: despesasMensais[index + 1] || 0,
    }));
  }, [despesasMensais]);

  // Dados dinâmicos para barras de visão por categoria (apenas despesas pagas)
  const categoryBarsData = useMemo(() => {
    // Filtrar apenas despesas que já foram pagas
    const paidExpenses = despesas.filter((despesa) =>
      isDateTodayOrBefore(despesa.data_pagamento),
    );

    if (paidExpenses.length === 0) {
      return [];
    }

    // Agrupar por categoria
    const categoryMap = new Map<string, number>();

    paidExpenses.forEach((despesa) => {
      const categoryName = despesa.tipo || despesa.descricao || "Outros";
      const currentValue = categoryMap.get(categoryName) || 0;
      categoryMap.set(categoryName, currentValue + despesa.valor);
    });

    // Cores fixas para cada categoria
    const categoryColors: { [key: string]: string } = {
      alimentação: "#FF6B6B",
      transporte: "#4ECDC4",
      moradia: "#45B7D1",
      lazer: "#96CEB4",
      saúde: "#FFEAA7",
      educação: "#DDA0DD",
      mercado: "#98D8C8",
      outros: "#B0BEC5",
    };

    // Calcular total gasto
    const totalSpent = Array.from(categoryMap.values()).reduce(
      (sum, val) => sum + val,
      0,
    );

    // Converter para array e ordenar por valor gasto
    return Array.from(categoryMap.entries())
      .map(([name, spent]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        spent: spent,
        planned: spent, // Usar o valor gasto como planejado
        percentage: totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0,
        color: categoryColors[name.toLowerCase()] || "#B0BEC5",
      }))
      .sort((a, b) => b.spent - a.spent);
  }, [despesas]);

  // Definir colunas para a tabela de despesas
  const despesasColumns: TableColumn[] = [
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
      render: (value) => <span className="value expense">{value}</span>,
    },
  ];

  // Definir colunas para a tabela de contas a pagar
  const contasAPagarColumns: TableColumn[] = [
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
      render: (value) => <span className="value expense">{value}</span>,
    },
  ];

  return (
    <div className="despesas-page">
      {/* Filtro de Mês, Ano e Dia */}
      <PageHeader
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
      />

      {/* Cards principais */}
      <FinancialCardGrid
        cards={[
          {
            title: "DESPESA ATUAL",
            value: formatValue(despesaAtual),
            icon: carteiraCardDespesasdoMês,
            type: "negative",
          },
          {
            title: "Contas a pagar",
            value: formatValue(contasAPagar),
            icon: simboloMenuBolsoContasAPagar,
            type: "neutral",
          },
        ]}
        isBalanceVisible={isBalanceVisible}
        onToggleVisibility={toggleBalanceVisibility}
        className="despesas-cards"
      />

      {/* Conteúdo Principal */}
      <div className="despesas-content">
        {/* Primeira linha com tabelas */}
        <div className="despesas-tables-row">
          {/* Últimas Saídas */}
          <TransactionTable
            title="Últimas Saídas"
            columns={despesasColumns}
            data={despesasData}
            className="despesas-table-card"
            showSummary={true}
            summaryCountLabel="Saídas"
            valueKey="value"
            showActions={true}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />

          {/* Contas a Pagar */}
          <TransactionTable
            title="Contas a Pagar"
            columns={contasAPagarColumns}
            data={contasAPagarData}
            className="despesas-table-card"
            showSummary={true}
            summaryCountLabel="Contas"
            valueKey="value"
            showActions={true}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        </div>

        {/* Segunda linha com gráficos */}
        <div className="despesas-charts-row">
          {/* Despesas por categoria - Gráfico de Pizza */}
          <ExpensesPieChart
            title="Despesas por categoria"
            totalLabel="TOTAL DESPESAS"
            totalValue={formatValue(despesaAtual)}
            categories={pieChartData}
            className="despesas-card chart-card"
          />

          {/* Visão por categoria */}
          <CategoryBudgetCard
            data={categoryBarsData}
            className="despesas-card category-bars-card"
          />
        </div>
      </div>

      {/* Botão Flutuante de Adicionar */}
      <button
        className="floating-add-button"
        onClick={handleAddDespesa}
        aria-label="Adicionar nova despesa"
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

      {/* Modal de Despesas */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={handleCloseExpenseModal}
        onSave={handleSaveExpense}
        onUpdate={handleSaveExpense}
        onDelete={
          isEditMode && editingExpense
            ? async () => {
                if (
                  !window.confirm(
                    "Tem certeza que deseja excluir esta despesa?",
                  )
                ) {
                  return;
                }
                try {
                  await transactionsService.delete(Number(editingExpense.id));
                  await refetchDespesas();
                  handleCloseExpenseModal();
                  console.log("✅ Despesa deletada com sucesso");
                } catch (error) {
                  console.error("❌ Erro ao deletar despesa:", error);
                  alert("Erro ao deletar despesa. Tente novamente.");
                }
              }
            : undefined
        }
        editingExpense={editingExpense}
        mode={isEditMode ? "edit" : "add"}
      />
    </div>
  );
};

export default Despesas;
