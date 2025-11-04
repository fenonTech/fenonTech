import React, { useState, useMemo } from "react";
import "./Dashboard.css";
import { UnifiedFinancialCard } from "../../components/Cards";
import MobileFinancialCard from "../../components/MobileFinancialCard";
import TransactionTable from "../../components/TransactionTable";
import type { TableColumn } from "../../components/TransactionTable";
import ExpensesPieChart from "../../components/ExpensesPieChart";
import MonthYearSelector from "../../components/MonthYearSelector";
import { useTransaction } from "../../contexts/TransactionContext";
import useTabs from "../../hooks/useTabs";
import useFinancialCardNavigation from "../../hooks/useFinancialCardNavigation";
import { useBalanceVisibility } from "../../hooks/useBalanceVisibility";
import dinheiroSaldo from "../../assets/dinheiroSaldo.png";
import sacoDeDinheiro from "../../assets/sacoDeDinheiro.png";
import setaParaBaixo from "../../assets/setaParaBaixo.png";
import simboloMenuBolsoContasAPagar from "../../assets/simboloMenuBolsoContasAPagar.png";

const Dashboard: React.FC = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Acessar dados do contexto
  const { incomes, expenses, payables, receivables, budgets } = useTransaction();

  // Função para filtrar dados por mês/ano
  const filterByMonthYear = (
    data: any[],
    selectedMonth: number,
    selectedYear: number
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

  // Calcular totais considerando apenas valores até a data atual
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filtrar receitas até hoje (incomes)
  const pastIncomes = useMemo(() => {
    return incomes.filter((income) => {
      const [year, month, day] = income.date.split("-").map(Number);
      const incomeDate = new Date(year, month - 1, day);
      return incomeDate <= today;
    });
  }, [incomes]);

  // Filtrar despesas até hoje (expenses)
  const pastExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const [year, month, day] = expense.date.split("-").map(Number);
      const expenseDate = new Date(year, month - 1, day);
      return expenseDate <= today;
    });
  }, [expenses]);

  // Total de receitas até hoje
  const totalPastIncome = useMemo(
    () => pastIncomes.reduce((sum, income) => sum + income.value, 0),
    [pastIncomes]
  );

  // Total de despesas até hoje
  const totalPastExpense = useMemo(
    () => pastExpenses.reduce((sum, expense) => sum + expense.value, 0),
    [pastExpenses]
  );

  // Saldo atual: receitas até hoje - despesas até hoje
  const currentBalance = useMemo(
    () => totalPastIncome - totalPastExpense,
    [totalPastIncome, totalPastExpense]
  );

  // Valores a receber: apenas receivables (contas a receber futuras)
  const totalReceivables = useMemo(
    () => receivables.reduce((sum, receivable) => sum + receivable.value, 0),
    [receivables]
  );

  // Contas a pagar: apenas payables (contas a pagar futuras)
  const totalPayables = useMemo(
    () => payables.reduce((sum, payable) => sum + payable.value, 0),
    [payables]
  );

  // Filtros para o mês/ano selecionado (para gráficos e tabelas)
  const filteredIncomes = useMemo(
    () => filterByMonthYear(incomes, selectedMonth, selectedYear),
    [incomes, selectedMonth, selectedYear]
  );

  const filteredExpenses = useMemo(
    () => filterByMonthYear(expenses, selectedMonth, selectedYear),
    [expenses, selectedMonth, selectedYear]
  );

  // Total de despesas do mês selecionado (para o gráfico de pizza)
  const totalMonthExpenses = useMemo(
    () => filteredExpenses.reduce((sum, expense) => sum + expense.value, 0),
    [filteredExpenses]
  );

  // Combinar transações de receitas e despesas para a tabela
  const allTransactions = useMemo(() => {
    const incomeTransactions = filteredIncomes.map((income) => {
      // Parse correto da data para evitar problema de timezone
      const [year, month, day] = income.date.split("-").map(Number);
      const incomeDate = new Date(year, month - 1, day);

      return {
        id: income.id,
        date: incomeDate.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        description: income.description || income.category,
        category: income.category,
        value: income.formattedValue,
        type: "income" as const,
      };
    });

    const expenseTransactions = filteredExpenses.map((expense) => {
      // Parse correto da data para evitar problema de timezone
      const [year, month, day] = expense.date.split("-").map(Number);
      const expenseDate = new Date(year, month - 1, day);

      return {
        id: expense.id,
        date: expenseDate.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        description: expense.description || expense.category,
        category: expense.category,
        value: expense.formattedValue,
        type: "expense" as const,
      };
    });

    // Combinar e ordenar por data (mais recente primeiro)
    return [...incomeTransactions, ...expenseTransactions]
      .sort((a, b) => {
        const dateA = new Date(
          `${selectedYear}-${a.date.split("/").reverse().join("-")}`
        );
        const dateB = new Date(
          `${selectedYear}-${b.date.split("/").reverse().join("-")}`
        );
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 10); // Limitar a 10 transações mais recentes
  }, [filteredIncomes, filteredExpenses, selectedYear]);

  // Contas a pagar dinâmicas (payables)
  const filteredPayables = useMemo(
    () => filterByMonthYear(payables, selectedMonth, selectedYear),
    [payables, selectedMonth, selectedYear]
  );

  const bills = useMemo(
    () =>
      filteredPayables
        .map((payable) => {
          // Parse correto da data para evitar problema de timezone
          const [year, month, day] = payable.dueDate.split("-").map(Number);
          const dueDate = new Date(year, month - 1, day);

          return {
            date: dueDate.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            }),
            description: payable.description || payable.category,
            category: payable.category,
            value: payable.formattedValue,
          };
        })
        .slice(0, 8), // Limitar a 8 contas para não sobrecarregar a tabela
    [filteredPayables]
  );

  // Dados dinâmicos do gráfico de pizza por categoria
  const categoryData = useMemo(() => {
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
    filteredExpenses.forEach((expense) => {
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
      .filter((cat) => cat.percentage > 0 || filteredExpenses.length === 0); // Mostrar categorias com dados ou todas se não houver dados
  }, [filteredExpenses]);

  // Dados para Visão por categoria com comparação entre gasto e previsto
  const categoryComparisonData = useMemo(() => {
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

    // Mapear categorias com dados reais e previstos
    return predefinedCategories
      .map((predefCategory) => {
        const spent = categoryTotals[predefCategory.name] || 0;
        const planned = categoryBudgets[predefCategory.name] || 0;
        const percentage =
          planned > 0 ? Math.min((spent / planned) * 100, 100) : 0;

        return {
          name: predefCategory.name,
          spent: spent,
          planned: planned,
          percentage: percentage,
          color: predefCategory.color,
        };
      })
      .filter((cat) => cat.planned > 0 || cat.spent > 0); // Mostrar apenas categorias com dados
  }, [filteredExpenses, budgets, selectedMonth, selectedYear]);

  const transactionColumns: TableColumn[] = [
    {
      key: "date",
      label: "Data",
      render: (value) => <span>{value}</span>,
    },
    {
      key: "description",
      label: "Descrição",
      render: (value) => <span>{value}</span>,
    },
    {
      key: "category",
      label: "Categoria",
      render: (value, row) => (
        <span className={`category ${row?.type}`}>{value}</span>
      ),
    },
    {
      key: "value",
      label: "Valor",
      render: (value, row) => (
        <span className={`value ${row?.type}`}>{value}</span>
      ),
    },
  ];

  const billsColumns: TableColumn[] = [
    {
      key: "date",
      label: "Data",
      render: (value) => <span>{value}</span>,
    },
    {
      key: "description",
      label: "Descrição",
      render: (value) => <span>{value}</span>,
    },
    {
      key: "category",
      label: "Categoria",
      render: (value) => <span className="category expense">{value}</span>,
    },
    {
      key: "value",
      label: "Valor",
      render: (value) => <span className="value expense">{value}</span>,
    },
  ];

  const { activeTab, switchTab } = useTabs("graficos");
  const { activeCard, switchCard } = useFinancialCardNavigation("saldo");
  const { isBalanceVisible, toggleBalanceVisibility, formatValue } =
    useBalanceVisibility();

  // Configuração das opções do card mobile
  const mobileCardOptions = [
    {
      key: "saldo",
      label: "Saldo",
      title: "Saldo Atual",
      value: formatValue(`R$ ${currentBalance.toFixed(2).replace(".", ",")}`),
      icon: dinheiroSaldo,
      type: "neutral" as const,
    },
    {
      key: "receita",
      label: "A Receber",
      title: "Valores a Receber",
      value: formatValue(`R$ ${totalReceivables.toFixed(2).replace(".", ",")}`),
      icon: sacoDeDinheiro,
      type: "positive" as const,
    },
    {
      key: "despesa",
      label: "A Pagar",
      title: "Contas a Pagar",
      value: formatValue(`R$ ${totalPayables.toFixed(2).replace(".", ",")}`),
      icon: setaParaBaixo,
      type: "negative" as const,
    },
  ];

  return (
    <div className="dashboard">
      {/* Filtro de Mês e Ano */}
      <div className="dashboard-header">
        <MonthYearSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          className="header-style"
        />
      </div>

      {/* Cards Originais - DESKTOP */}
      <div className="financial-cards">
        <UnifiedFinancialCard
          title="Saldo Atual"
          value={formatValue(
            `R$ ${currentBalance.toFixed(2).replace(".", ",")}`
          )}
          icon={dinheiroSaldo}
          type="neutral"
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
        <UnifiedFinancialCard
          title="Valores a Receber"
          value={formatValue(`R$ ${totalReceivables.toFixed(2).replace(".", ",")}`)}
          icon={sacoDeDinheiro}
          type="positive"
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
        <UnifiedFinancialCard
          title="Contas a Pagar"
          value={formatValue(`R$ ${totalPayables.toFixed(2).replace(".", ",")}`)}
          icon={setaParaBaixo}
          type="negative"
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
      </div>

      {/* Sistema de Navegação - APENAS MOBILE */}
      <MobileFinancialCard
        navigationOptions={mobileCardOptions}
        activeCard={activeCard}
        onCardSwitch={(cardKey) => switchCard(cardKey as any)}
        className="dashboard-mobile-card"
      />

      {/* Sistema de Tabs - apenas no mobile */}
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === "graficos" ? "active" : ""}`}
          onClick={() => switchTab("graficos")}
        >
          Gráfico{" "}
        </button>
        <button
          className={`tab-button ${activeTab === "principal" ? "active" : ""}`}
          onClick={() => switchTab("principal")}
        >
          Transações
        </button>
      </div>

      {/* Conteúdo Desktop - Sempre Visível */}
      <div className="desktop-content">
        {/* Primeira Linha - Transações + Gráfico Pizza */}
        <div className="dashboard-first-row">
          {/* Últimas Transações */}
          <TransactionTable
            title="Últimas Transações"
            columns={transactionColumns}
            data={allTransactions}
            className="transactions-card"
            showSummary={true}
            summaryCountLabel="Transações"
            valueKey="value"
          />

          {/* Despesas por categoria (gráfico de pizza) */}
          <ExpensesPieChart
            title="Despesas por categoria"
            totalLabel="TOTAL DESPESAS"
            totalValue={`R$ ${totalMonthExpenses.toFixed(2).replace(".", ",")}`}
            categories={categoryData}
            className="expenses-chart-card"
          />
        </div>

        {/* Segunda Linha - Contas + Visão Categoria */}
        <div className="dashboard-second-row">
          {/* Contas a pagar */}
          <TransactionTable
            title="Contas a pagar"
            columns={billsColumns}
            data={bills}
            showIcon={true}
            icon={simboloMenuBolsoContasAPagar}
            iconPosition="left"
            showSummary={true}
            summaryCountLabel="Contas"
            valueKey="value"
            className="bills-table-orange"
          />

          {/* Visão por categoria */}
          <div className="dashboard-card">
            <h3 className="card-header">Visão por categoria</h3>
            <div className="category-bars">
              {categoryComparisonData.length > 0 ? (
                categoryComparisonData.map((item, index) => (
                  <div key={index} className="category-bar-item">
                    <div className="category-info">
                      <span className="category-name">{item.name}</span>
                      <span className="category-amount">
                        (R$ {item.spent.toFixed(2).replace(".", ",")} de R${" "}
                        {item.planned.toFixed(2).replace(".", ",")})
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${item.percentage}%`,
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
      </div>

      {/* Conteúdo Tab Principal - Apenas Mobile */}
      <div
        className={`tab-content mobile-only tab-principal ${
          activeTab === "principal" ? "active" : ""
        }`}
        style={{ display: activeTab === "principal" ? "block" : "none" }}
      >
        <div className="dashboard-grid">
          {/* Últimas Transações */}
          <TransactionTable
            title="Últimas Transações"
            columns={transactionColumns}
            data={allTransactions}
            className="transactions-card"
            showSummary={true}
            summaryCountLabel="Transações"
            valueKey="value"
          />
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
          {/* Visão por categoria */}
          <div className="dashboard-card">
            <h3 className="card-header">Visão por categoria</h3>
            <div className="category-bars">
              {categoryComparisonData.length > 0 ? (
                categoryComparisonData.map((item, index) => (
                  <div key={index} className="category-bar-item">
                    <div className="category-info">
                      <span className="category-name">{item.name}</span>
                      <span className="category-amount">
                        (R$ {item.spent.toFixed(2).replace(".", ",")} de R${" "}
                        {item.planned.toFixed(2).replace(".", ",")})
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${item.percentage}%`,
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
      </div>
    </div>
  );
};

export default Dashboard;
