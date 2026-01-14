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
    selectedYear
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
          category: despesa.tipo,
          type: despesa.descricao || "Variável",
          value: formatCurrency(despesa.valor),
          originalData: despesa,
        };
      });
  }, [despesas]);

  const contasAPagarData = useMemo(() => {
    return despesas
      .filter((despesa) => !isDateTodayOrBefore(despesa.data_pagamento))
      .map((despesa) => {
        return {
          id: despesa.codigo.toString(),
          date: formatTableDate(despesa.data_pagamento),
          category: despesa.tipo,
          type: "Pendente",
          value: formatCurrency(despesa.valor),
          originalData: despesa,
        };
      });
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
    // Categorias pré-cadastradas com cores fixas
    const predefinedCategories = [
      { name: "alimentação", color: "#FF6B6B" },
      { name: "transporte", color: "#4ECDC4" },
      { name: "moradia", color: "#45B7D1" },
      { name: "lazer", color: "#96CEB4" },
      { name: "saúde", color: "#FFEAA7" },
      { name: "educação", color: "#DDA0DD" },
      { name: "mercado", color: "#98D8C8" },
      { name: "outros", color: "#B0BEC5" },
    ];

    if (despesas.length === 0) {
      return predefinedCategories.map((cat) => ({
        ...cat,
        percentage: 0,
      }));
    }

    // Agrupar despesas por categoria (apenas despesas já pagas)
    const categoryTotals: { [key: string]: number } = {};
    despesas.forEach((despesa) => {
      if (isDateTodayOrBefore(despesa.data_pagamento)) {
        const category = despesa.tipo?.toLowerCase() || "outros";
        categoryTotals[category] =
          (categoryTotals[category] || 0) + despesa.valor;
      }
    });

    const totalExpenseValue = Object.values(categoryTotals).reduce(
      (sum, value) => sum + value,
      0
    );

    // Mapear categorias pré-definidas com dados reais
    return predefinedCategories
      .map((predefCategory) => {
        const value = categoryTotals[predefCategory.name] || 0;
        return {
          name:
            predefCategory.name.charAt(0).toUpperCase() +
            predefCategory.name.slice(1),
          percentage:
            totalExpenseValue > 0
              ? Math.round((value / totalExpenseValue) * 100)
              : 0,
          color: predefCategory.color,
        };
      })
      .filter((cat) => cat.percentage > 0 || despesas.length === 0);
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

  // Dados dinâmicos para barras de visão por categoria (apenas despesas)
  const categoryBarsData = useMemo(() => {
    if (despesas.length === 0) {
      return [];
    }

    // Agrupar por categoria
    const categoryMap = new Map<string, { spent: number; planned: number }>();

    despesas.forEach((despesa) => {
      const categoryName = despesa.tipo || despesa.descricao || "Outros";

      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, { spent: 0, planned: 0 });
      }

      const categoryData = categoryMap.get(categoryName)!;
      categoryData.planned += despesa.valor;

      // Se já foi pago (data <= hoje), adiciona ao gasto
      if (isDateTodayOrBefore(despesa.data_pagamento)) {
        categoryData.spent += despesa.valor;
      }
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

    // Converter para array e ordenar por valor planejado
    return Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        spent: data.spent,
        planned: data.planned,
        percentage:
          data.planned > 0 ? Math.round((data.spent / data.planned) * 100) : 0,
        color: categoryColors[name.toLowerCase()] || "#B0BEC5",
      }))
      .sort((a, b) => b.planned - a.planned);
  }, [despesas]);

  // Definir colunas para a tabela de despesas
  const despesasColumns: TableColumn[] = [
    { key: "date", label: "Data" },
    { key: "category", label: "Categoria" },
    {
      key: "type",
      label: "Tipo",
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
    { key: "date", label: "Data" },
    { key: "category", label: "Categoria" },
    {
      key: "type",
      label: "Tipo",
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

        {/* Gráfico de Despesas Mensais */}
        <MonthlyBarChart
          title="Despesas por Mês"
          data={monthlyData}
          className="despesas-card chart-card"
        />
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
                    "Tem certeza que deseja excluir esta despesa?"
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
