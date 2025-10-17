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
  const { incomes, expenses, payables } = useTransaction();

  // Função para filtrar dados por mês/ano
  const filterByMonthYear = (
    data: any[],
    selectedMonth: number,
    selectedYear: number
  ) => {
    return data.filter((item) => {
      const itemDate = new Date(item.date || item.dueDate);
      return (
        itemDate.getMonth() === selectedMonth &&
        itemDate.getFullYear() === selectedYear
      );
    });
  };

  // Calcular totais dinâmicos usando useMemo
  const filteredIncomes = useMemo(
    () => filterByMonthYear(incomes, selectedMonth, selectedYear),
    [incomes, selectedMonth, selectedYear]
  );

  const filteredExpenses = useMemo(
    () => filterByMonthYear(expenses, selectedMonth, selectedYear),
    [expenses, selectedMonth, selectedYear]
  );

  const totalIncome = useMemo(
    () => filteredIncomes.reduce((sum, income) => sum + income.value, 0),
    [filteredIncomes]
  );

  const totalExpense = useMemo(
    () => filteredExpenses.reduce((sum, expense) => sum + expense.value, 0),
    [filteredExpenses]
  );

  const currentBalance = useMemo(
    () => totalIncome - totalExpense,
    [totalIncome, totalExpense]
  );

  // Combinar transações de receitas e despesas para a tabela
  const allTransactions = useMemo(() => {
    const incomeTransactions = filteredIncomes.map((income) => ({
      id: income.id,
      date: new Date(income.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      description: income.description || income.category,
      category: income.category,
      value: income.formattedValue,
      type: "income" as const,
    }));

    const expenseTransactions = filteredExpenses.map((expense) => ({
      id: expense.id,
      date: new Date(expense.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      description: expense.description || expense.category,
      category: expense.category,
      value: expense.formattedValue,
      type: "expense" as const,
    }));

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
        .map((payable) => ({
          date: new Date(payable.dueDate).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          }),
          description: payable.description || payable.category,
          category: payable.category,
          value: payable.formattedValue,
        }))
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
      label: "Receita",
      title: "Receita Atual",
      value: formatValue(`R$ ${totalIncome.toFixed(2).replace(".", ",")}`),
      icon: sacoDeDinheiro,
      type: "positive" as const,
    },
    {
      key: "despesa",
      label: "Despesa",
      title: "DESPESA ATUAL",
      value: formatValue(`R$ ${totalExpense.toFixed(2).replace(".", ",")}`),
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
          title="Receita Atual"
          value={formatValue(`R$ ${totalIncome.toFixed(2).replace(".", ",")}`)}
          icon={sacoDeDinheiro}
          type="positive"
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
        <UnifiedFinancialCard
          title="DESPESA ATUAL"
          value={formatValue(`R$ ${totalExpense.toFixed(2).replace(".", ",")}`)}
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
            totalValue={`R$ ${totalExpense.toFixed(2).replace(".", ",")}`}
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
              {categoryData.map((item, index) => (
                <div key={index} className="category-bar-item">
                  <div className="category-info">
                    <span className="category-name">{item.name}</span>
                    <span className="category-amount">
                      (R$ {(item.percentage * 67.49).toFixed(2)} de R$ 100,00)
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
              ))}
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
              {categoryData.map((item, index) => (
                <div key={index} className="category-bar-item">
                  <div className="category-info">
                    <span className="category-name">{item.name}</span>
                    <span className="category-amount">
                      (R$ {(item.percentage * 67.49).toFixed(2)} de R$ 100,00)
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
