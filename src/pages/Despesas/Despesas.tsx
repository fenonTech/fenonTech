import React, { useState, useMemo, useEffect, useRef } from "react";
import "./Despesas.css";
import { UnifiedFinancialCard } from "../../components/Cards";
import MobileFinancialCard from "../../components/MobileFinancialCard";
import TransactionTable from "../../components/TransactionTable";
import type { TableColumn } from "../../components/TransactionTable";
import ExpensesPieChart from "../../components/ExpensesPieChart";
import MonthYearSelector from "../../components/MonthYearSelector";
import DaySelector from "../../components/DaySelector";
import { ExpenseModal } from "../../components/Modals";

import { useTransaction } from "../../contexts/TransactionContext";
import useDespesasNavigation from "../../hooks/useDespesasNavigation";
import useTabs from "../../hooks/useTabs";
import { useBalanceVisibility } from "../../hooks/useBalanceVisibility";
import {
  transactionApiService,
  parseMoneyValue,
  convertApiTransactionToLocal,
} from "../../services";
import { formatCurrency } from "../../utils";
import carteiraCardDespesasdoMês from "../../assets/carteiraCardDespesasdoMês.png";
import simboloMenuBolsoContasAPagar from "../../assets/simboloMenuBolsoContasAPagar.png";

const Despesas: React.FC = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { activeCard, switchCard } = useDespesasNavigation("despesas");
  const { activeTab, switchTab } = useTabs("graficos");
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
        `✅ Adicionados: ${despesasCount} despesas pagas, ${payablesCount} contas a pagar`
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
      }?`
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

  // Função para filtrar dados por mês/ano e dia
  const filterByMonthYearDay = (
    data: any[],
    selectedMonth: number,
    selectedYear: number,
    selectedDay: number | null
  ) => {
    return data.filter((item) => {
      // Parse correto da data para evitar problema de timezone
      const dateString = item.date || item.dueDate;
      const [year, month, day] = dateString.split("-").map(Number);
      const itemDate = new Date(year, month - 1, day);

      const matchesMonthYear =
        itemDate.getMonth() === selectedMonth &&
        itemDate.getFullYear() === selectedYear;

      if (!matchesMonthYear) return false;

      // Se um dia específico foi selecionado, filtrar por ele também
      if (selectedDay !== null) {
        return itemDate.getDate() === selectedDay;
      }

      return true;
    });
  };

  // Filtrar despesas e contas a pagar pelo mês/ano/dia selecionado
  const filteredExpenses = useMemo(
    () =>
      filterByMonthYearDay(expenses, selectedMonth, selectedYear, selectedDay),
    [expenses, selectedMonth, selectedYear, selectedDay]
  );

  const filteredPayables = useMemo(
    () =>
      filterByMonthYearDay(payables, selectedMonth, selectedYear, selectedDay),
    [payables, selectedMonth, selectedYear, selectedDay]
  );

  // Converter dados do contexto para formato das tabelas
  const formatExpenseData = (expenses: any[]) => {
    return expenses.map((expense) => {
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
    });
  };

  const formatPayableData = (payables: any[]) => {
    return payables.map((payable) => {
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
        type: payable.status === "pending" ? "Pendente" : "Pago",
        value: payable.formattedValue,
        // Manter dados originais para edição
        originalDate: payable.dueDate,
        originalValue: payable.value,
        originalData: payable,
      };
    });
  };

  // Calcular totais usando dados filtrados
  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.value,
    0
  );
  const totalPayables = filteredPayables.reduce(
    (sum, payable) => sum + payable.value,
    0
  );

  // Configuração das opções do card mobile
  const mobileCardOptions = [
    {
      key: "despesas",
      label: "Despesas",
      title: "DESPESA ATUAL",
      value: formatValue(`R$ ${totalExpenses.toFixed(2).replace(".", ",")}`),
      icon: carteiraCardDespesasdoMês,
      type: "negative" as const,
    },
    {
      key: "contas",
      label: "A Pagar",
      title: "CONTAS A PAGAR",
      value: formatValue(`R$ ${totalPayables.toFixed(2).replace(".", ",")}`),
      icon: simboloMenuBolsoContasAPagar,
      type: "negative" as const,
    },
  ];

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
      0
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

  // Dados para o gráfico de barras - Calculado com base nas despesas reais
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

    // Inicializar array com 0 para cada mês
    const monthlyTotals = Array(12).fill(0);

    // Somar todas as despesas (pagas) do ano selecionado
    expenses.forEach((expense) => {
      const [year, month] = expense.date.split("-").map(Number);
      if (year === selectedYear) {
        monthlyTotals[month - 1] += expense.value;
      }
    });

    // Criar array de objetos para o gráfico
    return months.map((month, index) => ({
      month,
      value: monthlyTotals[index],
    }));
  }, [expenses, selectedYear]);

  const maxValue = Math.max(...monthlyData.map((item) => item.value), 1); // Mínimo 1 para evitar divisão por zero

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
          budget.type === "expense"
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
      <div className="despesas-header">
        <div className="despesas-filters">
          <MonthYearSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            className="header-style"
          />
          <DaySelector
            selectedDay={selectedDay}
            onDayChange={setSelectedDay}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            className="day-filter"
          />
        </div>
      </div>

      {/* Sistema de Navegação Integrado - APENAS MOBILE */}
      <MobileFinancialCard
        navigationOptions={mobileCardOptions}
        activeCard={activeCard}
        onCardSwitch={(cardKey) => switchCard(cardKey as any)}
        className="despesas-mobile-card"
      />

      {/* Cards principais - Desktop */}
      <div className="despesas-cards desktop-content">
        <UnifiedFinancialCard
          title="DESPESA ATUAL"
          value={formatValue(
            `R$ ${totalExpenses.toFixed(2).replace(".", ",")}`
          )}
          icon={carteiraCardDespesasdoMês}
          type="negative"
          className="despesa-card-large"
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
        <UnifiedFinancialCard
          title="Contas a pagar"
          value={formatValue(
            `R$ ${totalPayables.toFixed(2).replace(".", ",")}`
          )}
          icon={simboloMenuBolsoContasAPagar}
          type="neutral"
          className="despesa-card-large"
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
      </div>

      {/* Sistema de Tabs - apenas no mobile */}
      <div className="dashboard-tabs mobile-only">
        <button
          className={`tab-button ${activeTab === "graficos" ? "active" : ""}`}
          onClick={() => switchTab("graficos")}
        >
          Gráfico
        </button>
        <button
          className={`tab-button ${activeTab === "principal" ? "active" : ""}`}
          onClick={() => switchTab("principal")}
        >
          Transações
        </button>
      </div>

      {/* Conteúdo Tab Principal - Apenas Mobile */}
      <div
        className={`tab-content mobile-only tab-principal ${
          activeTab === "principal" ? "active" : ""
        }`}
        style={{ display: activeTab === "principal" ? "block" : "none" }}
      >
        <div className="dashboard-grid">
          {/* Mostrar tabela baseada no card ativo */}
          {activeCard === "despesas" ? (
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
          ) : (
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
          )}
        </div>
      </div>

      {/* Conteúdo Tab Análise - Apenas Mobile */}
      <div
        className={`tab-content mobile-only tab-analise ${
          activeTab === "graficos" ? "active" : ""
        }`}
        style={{ display: activeTab === "graficos" ? "block" : "none" }}
      >
        <div className="dashboard-grid">
          {/* Despesas por categoria - Gráfico de Pizza */}
          <ExpensesPieChart
            title="Despesas por categoria"
            totalLabel="TOTAL DESPESAS"
            totalValue={`R$ ${totalExpenses.toFixed(2).replace(".", ",")}`}
            categories={pieChartData}
            className="despesas-card chart-card"
          />
        </div>
      </div>

      {/* Conteúdo Desktop - Sempre Visível */}
      <div className="despesas-content desktop-content">
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
          <div className="despesas-card category-bars-card">
            <h3 className="card-header">Visão por categoria</h3>
            <div className="category-bars">
              {categoryBarsData.length > 0 ? (
                categoryBarsData.map((item, index) => (
                  <div key={index} className="category-bar-item">
                    <div className="category-info">
                      <span className="category-name">{item.name}</span>
                      <span className="category-amount">
                        (R$ {item.spent.toFixed(2).replace(".", ",")} de R${" "}
                        {item.total.toFixed(2).replace(".", ",")})
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${
                            item.total > 0
                              ? Math.min((item.spent / item.total) * 100, 100)
                              : 0
                          }%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    color: "#999",
                    padding: "20px",
                  }}
                >
                  Nenhum orçamento planejado para este mês
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Gráfico de Despesas Mensais */}
        <div className="despesas-card chart-card">
          <h3 className="card-header">Despesas por Mês</h3>
          <div className="chart-container">
            <div className="bar-chart">
              {monthlyData.map((item, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-wrapper">
                    <div
                      className="bar"
                      style={{
                        height: `${(item.value / maxValue) * 100}%`,
                        opacity: item.value === 0 ? 0.3 : 1,
                      }}
                      title={`${item.month}: R$ ${item.value
                        .toFixed(2)
                        .replace(".", ",")}`}
                    >
                      <span className="bar-tooltip">
                        R$ {item.value.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>
                  <span className="bar-label">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
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
