import React, { useState, useMemo, useEffect, useRef } from "react";
import "./Despesas.css";
import TransactionTable from "../../../components/TransactionTable";
import type { TableColumn } from "../../../components/TransactionTable";
import ExpensesPieChart from "../../../components/ExpensesPieChart";
import PageHeader from "../../../components/PageHeader";
import FinancialCardGrid from "../../../components/FinancialCardGrid";
import CategoryBudgetCard from "../../../components/CategoryBudgetCard";
import { ExpenseModal } from "../../../components/Modals";

import { useTransaction } from "../../../contexts/TransactionContext";
import { useFilter } from "../../../contexts/FilterContext";

import { useBalanceVisibility } from "../../../hooks/useBalanceVisibility";
import {
  transactionApiService,
  parseMoneyValue,
  convertApiTransactionToLocal,
} from "../../../services";
import { formatCurrency } from "../../../utils";
import carteiraCardDespesasdoMês from "../../../assets/carteiraCardDespesasdoMês.png";
import simboloMenuBolsoContasAPagar from "../../../assets/simboloMenuBolsoContasAPagar.png";

const Despesas: React.FC = () => {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } =
    useFilter();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { isBalanceVisible, toggleBalanceVisibility, formatValue } =
    useBalanceVisibility();
  const {
    expenses,
    payables,
    budgets,
    addExpense,
    addExpenseComplete,
    updateExpense,
    deleteExpense,
    addPayable,
    addPayableComplete,
    updatePayable,
    deletePayable,
    clearExpenses,
    clearPayables,
  } = useTransaction();

  // Ref para controlar se já carregou inicialmente
  const initialLoadDone = useRef(false);

  // Função para carregar/recarregar despesas da API
  const recarregarDados = async () => {
    console.log("🔄 Recarregando dados...");
    clearExpenses();
    clearPayables();

    try {
      const apiExpenses = await transactionApiService.getExpenses();
      console.log(`📦 Recebido ${apiExpenses.length} registros da API`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let despesasCount = 0;
      let payablesCount = 0;

      apiExpenses.forEach((apiExpense) => {
        const converted = convertApiTransactionToLocal(apiExpense);

        if (!converted || converted.type !== "expense") {
          return;
        }

        const expenseDate = new Date(apiExpense.data_pagamento!);
        expenseDate.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas a data
        const isFuture = expenseDate > today;

        if (isFuture) {
          payablesCount++;
          addPayableComplete({
            id: converted.id,
            date: converted.date,
            dueDate: converted.date,
            category: converted.category,
            description: converted.description,
            value: converted.value,
            formattedValue: converted.formattedValue,
            status: "pending" as const,
            type: "payable" as const,
            createdAt: new Date(converted.createdAt),
            updatedAt: new Date(converted.createdAt),
          });
        } else {
          despesasCount++;
          addExpenseComplete({
            id: converted.id,
            date: converted.date,
            category: converted.category,
            description: converted.description,
            value: converted.value,
            formattedValue: converted.formattedValue,
            type: "expense" as const,
            createdAt: new Date(converted.createdAt),
            updatedAt: new Date(converted.createdAt),
          });
        }
      });

      console.log(
        `✅ Adicionados: ${despesasCount} despesas pagas, ${payablesCount} contas a pagar`,
      );
    } catch (error) {
      console.error("❌ Erro ao carregar despesas:", error);
    }
  };

  // Carregar despesas ao montar o componente
  useEffect(() => {
    // Prevenir dupla execução (React StrictMode em dev executa useEffect 2x)
    if (initialLoadDone.current) {
      return;
    }
    initialLoadDone.current = true;
    recarregarDados();
  }, []); // Executa apenas ao montar

  // Função para adicionar nova despesa/conta a pagar
  const handleAddDespesa = () => {
    setIsEditMode(false);
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  };

  // Função para editar despesa
  const handleEditExpense = (expense: any) => {
    // Usar os dados originais se disponíveis
    const expenseToEdit = expense.originalData || expense;
    setEditingExpense(expenseToEdit);
    setIsEditMode(true);
    setIsExpenseModalOpen(true);
  };

  // Função para excluir despesa
  const handleDeleteExpense = async (expense: any) => {
    // Usar os dados originais se disponíveis
    const expenseToDelete = expense.originalData || expense;
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a despesa "${
        expenseToDelete.category
      }" no valor de ${
        expenseToDelete.formattedValue || expenseToDelete.value
      }?`,
    );

    if (confirmDelete) {
      try {
        console.log("🗑️ Deletando despesa ID:", expenseToDelete.id);
        // Chamar API para deletar
        await transactionApiService.deleteExpense(expenseToDelete.id);

        console.log("✅ Despesa deletada! Recarregando...");
        initialLoadDone.current = false;
        await recarregarDados();
        initialLoadDone.current = true;
      } catch (error) {
        console.error("❌ Erro ao deletar despesa:", error);
        alert("Erro ao deletar despesa. Tente novamente.");
      }
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
    const amount =
      typeof expenseData.value === "string"
        ? parseMoneyValue(expenseData.value)
        : expenseData.value;
    const formattedValue = formatCurrency(amount);

    // Corrigir problema da data - usar a data local sem conversão de timezone
    const [year, month, day] = expenseData.date.split("-").map(Number);
    const expenseDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zerar horas para comparação correta
    const isContaAPagar = expenseDate > today;

    if (isEditMode && editingExpense) {
      // Modo edição - verificar se mudou de tipo (expense <-> payable)
      // Detectar tipo original pela data do item
      const originalDate = editingExpense.date || editingExpense.dueDate;
      const [origYear, origMonth, origDay] = originalDate
        .split("-")
        .map(Number);
      const originalItemDate = new Date(origYear, origMonth - 1, origDay);
      const todayForComparison = new Date();
      todayForComparison.setHours(0, 0, 0, 0);
      const wasPayable = originalItemDate > todayForComparison;
      const changedType = wasPayable !== isContaAPagar;

      const baseData = {
        id: editingExpense.id, // Usar o ID existente
        date: expenseData.date,
        description: expenseData.category,
        category: expenseData.category,
        value: amount,
        formattedValue,
        createdAt: editingExpense.createdAt || new Date(),
        updatedAt: new Date(),
      };

      if (changedType) {
        // Mudou de tipo: deletar do antigo e adicionar no novo
        if (wasPayable) {
          deletePayable(editingExpense.id);
          const expense = {
            ...baseData,
            type: "expense" as const,
          };
          addExpense(expense);
        } else {
          deleteExpense(editingExpense.id);
          const payable = {
            ...baseData,
            dueDate: expenseData.date,
            status: "pending" as const,
            type: "payable" as const,
          };
          addPayable(payable);
        }
      } else {
        // Mantém o mesmo tipo: chamar API para atualizar
        try {
          if (isContaAPagar) {
            // Para contas a pagar, apenas atualizar localmente
            const payable = {
              ...baseData,
              dueDate: expenseData.date,
              status: editingExpense.status || ("pending" as const),
              type: "payable" as const,
            };
            updatePayable(payable);
          } else {
            // Para despesas, chamar API de atualização
            await transactionApiService.updateExpense({
              transactionCode: parseInt(editingExpense.id, 10),
              date: expenseData.date,
              category: expenseData.category,
              value: amount,
            });

            console.log("✅ Despesa atualizada na API! Recarregando...");

            // Recarregar dados para sincronizar
            initialLoadDone.current = false;
            await recarregarDados();
            initialLoadDone.current = true;
          }
        } catch (error) {
          console.error("❌ Erro ao atualizar despesa na API:", error);
          // Se falhar na API, atualizar localmente para não bloquear o usuário
          if (isContaAPagar) {
            const payable = {
              ...baseData,
              dueDate: expenseData.date,
              status: editingExpense.status || ("pending" as const),
              type: "payable" as const,
            };
            updatePayable(payable);
          } else {
            const expense = {
              ...baseData,
              type: "expense" as const,
            };
            updateExpense(expense);
          }
        }
      }
    } else {
      // Modo criação - adicionar nova despesa
      try {
        await transactionApiService.createExpense({
          date: expenseData.date,
          category: expenseData.category,
          value: amount,
        });

        console.log("✅ Despesa criada! Recarregando...");
        initialLoadDone.current = false; // Permitir recarregar
        await recarregarDados();
        initialLoadDone.current = true; // Bloquear novamente
      } catch (error) {
        console.error("❌ Erro ao criar despesa na API:", error);
        // Se falhar, adicionar localmente para não bloquear o usuário
        const baseData = {
          date: expenseData.date,
          description: expenseData.category,
          category: expenseData.category,
          value: amount,
          formattedValue,
        };

        if (isContaAPagar) {
          addPayable({
            ...baseData,
            dueDate: expenseData.date,
            status: "pending" as const,
            type: "payable" as const,
          });
        } else {
          addExpense({
            ...baseData,
            type: "expense" as const,
          });
        }
      }
    }

    // Fechar o modal após salvar
    handleCloseExpenseModal();
  };

  // Função para filtrar dados por mês/ano
  const filterByMonthYear = (
    data: any[],
    selectedMonth: number,
    selectedYear: number,
  ) => {
    return data.filter((item) => {
      // Parse correto da data para evitar problema de timezone
      const dateString = item.date || item.dueDate;
      const [year, month, day] = dateString.split("-").map(Number);
      const itemDate = new Date(year, month - 1, day);

      return (
        itemDate.getMonth() === selectedMonth &&
        itemDate.getFullYear() === selectedYear
      );
    });
  };

  // Filtrar despesas e contas a pagar pelo mês/ano selecionado
  const filteredExpenses = useMemo(
    () => filterByMonthYear(expenses, selectedMonth, selectedYear),
    [expenses, selectedMonth, selectedYear],
  );

  const filteredPayables = useMemo(
    () => filterByMonthYear(payables, selectedMonth, selectedYear),
    [payables, selectedMonth, selectedYear],
  );

  // Converter dados do contexto para formato das tabelas
  const formatExpenseData = (expenses: any[]) => {
    return expenses
      .map((expense) => {
        // Parse correto da data para evitar problema de timezone
        const [year, month, day] = expense.date.split("-").map(Number);
        const expenseDate = new Date(year, month - 1, day);

        return {
          id: expense.id,
          date: expenseDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          }),
          category: expense.category,
          type: expense.description || "Variável",
          value: expense.formattedValue,
          // Manter dados originais para edição
          originalDate: expense.date,
          originalValue: expense.value,
          originalData: expense,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.originalDate).getTime() -
          new Date(a.originalDate).getTime(),
      );
  };

  const formatPayableData = (payables: any[]) => {
    return payables
      .map((payable) => {
        // Parse correto da data para evitar problema de timezone
        const [year, month, day] = payable.dueDate.split("-").map(Number);
        const dueDate = new Date(year, month - 1, day);

        return {
          id: payable.id,
          date: dueDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          }),
          category: payable.category,
          type: payable.description || "Variável",
          value: payable.formattedValue,
          // Manter dados originais para edição
          originalDate: payable.dueDate,
          originalValue: payable.value,
          originalData: payable,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.originalDate).getTime() -
          new Date(a.originalDate).getTime(),
      );
  };

  // Calcular totais usando dados filtrados
  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.value,
    0,
  );
  const totalPayables = filteredPayables.reduce(
    (sum, payable) => sum + payable.value,
    0,
  );

  // Dados dinâmicos das tabelas (usando dados filtrados)
  const despesasData = formatExpenseData(filteredExpenses);
  const contasAPagarData = formatPayableData(filteredPayables);

  // Dados dinâmicos para o gráfico de pizza
  const pieChartData = useMemo(() => {
    // Categorias pré-cadastradas com cores fixas
    const predefinedCategories = [
      { name: "Alimentação", color: "#FF6B6B" },
      { name: "Transporte", color: "#4ECDC4" },
      { name: "Moradia", color: "#45B7D1" },
      { name: "Lazer", color: "#96CEB4" },
      { name: "Saúde", color: "#FFEAA7" },
      { name: "Educação", color: "#DDA0DD" },
      { name: "Outros", color: "#98D8C8" },
    ];

    if (filteredExpenses.length === 0) {
      return predefinedCategories.map((cat) => ({
        ...cat,
        percentage: 0,
      }));
    }

    // Agrupar despesas por categoria
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach((expense) => {
      const category = expense.category || "Outros";
      categoryTotals[category] =
        (categoryTotals[category] || 0) + expense.value;
    });

    const totalExpenseValue = Object.values(categoryTotals).reduce(
      (sum, value) => sum + value,
      0,
    );

    // Mapear categorias pré-definidas com dados reais
    return predefinedCategories
      .map((predefCategory) => {
        const value = categoryTotals[predefCategory.name] || 0;
        return {
          name: predefCategory.name,
          percentage:
            totalExpenseValue > 0
              ? Math.round((value / totalExpenseValue) * 100)
              : 0,
          color: predefCategory.color,
        };
      })
      .filter((cat) => cat.percentage > 0 || filteredExpenses.length === 0);
  }, [filteredExpenses]);

  // Dados dinâmicos para barras de visão por categoria
  const categoryBarsData = useMemo(() => {
    const predefinedCategories = [
      { name: "Alimentação", color: "#FF6B6B" },
      { name: "Transporte", color: "#4ECDC4" },
      { name: "Moradia", color: "#45B7D1" },
      { name: "Lazer", color: "#96CEB4" },
      { name: "Saúde", color: "#FFEAA7" },
      { name: "Educação", color: "#DDA0DD" },
      { name: "Outros", color: "#98D8C8" },
    ];

    // Agrupar despesas por categoria
    const categoryTotals: { [key: string]: number } = {};
    filteredExpenses.forEach((expense) => {
      const category = expense.category || "Outros";
      categoryTotals[category] =
        (categoryTotals[category] || 0) + expense.value;
    });

    // Agrupar budgets por categoria para o mês/ano selecionado
    const categoryBudgets: { [key: string]: number } = {};
    budgets
      .filter(
        (budget) =>
          budget.month === selectedMonth &&
          budget.year === selectedYear &&
          budget.type === "expense",
      )
      .forEach((budget) => {
        categoryBudgets[budget.category] = budget.plannedAmount;
      });

    return predefinedCategories
      .map((category) => ({
        name: category.name,
        spent: categoryTotals[category.name] || 0,
        total: categoryBudgets[category.name] || 0,
        color: category.color,
      }))
      .filter((cat) => cat.total > 0 || cat.spent > 0); // Mostrar apenas categorias com dados
  }, [filteredExpenses, budgets, selectedMonth, selectedYear]);

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
            value: formatValue(totalExpenses),
            icon: carteiraCardDespesasdoMês,
            type: "negative",
          },
          {
            title: "Contas a pagar",
            value: formatValue(totalPayables),
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
            totalValue={`R$ ${totalExpenses.toFixed(2).replace(".", ",")}`}
            categories={pieChartData}
            className="despesas-card chart-card"
          />

          {/* Visão por categoria */}
          <CategoryBudgetCard
            data={categoryBarsData.map((item) => ({
              name: item.name,
              spent: item.spent,
              planned: item.total,
              percentage:
                item.total > 0
                  ? Math.min((item.spent / item.total) * 100, 100)
                  : 0,
              color: item.color,
            }))}
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
          isEditMode
            ? (id: string) => {
                const expenseDate = new Date(editingExpense?.date);
                const today = new Date();
                const isPayable = expenseDate > today;

                if (isPayable) {
                  deletePayable(id);
                } else {
                  deleteExpense(id);
                }
                handleCloseExpenseModal();
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
