import React, { useState, useMemo } from "react";
import "./Despesas.css";
import { UnifiedFinancialCard } from "../../components/Cards";
import MobileFinancialCard from "../../components/MobileFinancialCard";
import TransactionTable from "../../components/TransactionTable";
import type { TableColumn } from "../../components/TransactionTable";
import ExpensesPieChart from "../../components/ExpensesPieChart";
import MonthYearSelector from "../../components/MonthYearSelector";
import { ExpenseModal } from "../../components/Modals";

import { useTransaction } from "../../contexts/TransactionContext";
import useDespesasNavigation from "../../hooks/useDespesasNavigation";
import useTabs from "../../hooks/useTabs";
import { useBalanceVisibility } from "../../hooks/useBalanceVisibility";
import carteiraCardDespesasdoMês from "../../assets/carteiraCardDespesasdoMês.png";
import simboloMenuBolsoContasAPagar from "../../assets/simboloMenuBolsoContasAPagar.png";

const Despesas: React.FC = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
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
    addExpense,
    updateExpense,
    deleteExpense,
    addPayable,
    updatePayable,
    deletePayable,
  } = useTransaction();

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
  const handleDeleteExpense = (expense: any) => {
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
      // Verificar se é despesa ou conta a pagar pelo ID ou data
      const expenseDate = new Date(
        expenseToDelete.date || expenseToDelete.dueDate
      );
      const today = new Date();
      const isPayable = expenseDate > today;

      if (isPayable) {
        deletePayable(expenseToDelete.id);
      } else {
        deleteExpense(expenseToDelete.id);
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
  const handleSaveExpense = (expenseData: any) => {
    const amount =
      typeof expenseData.value === "string"
        ? parseFloat(expenseData.value.replace(/[^\d,]/g, "").replace(",", "."))
        : expenseData.value;
    const formattedValue = `R$ ${amount.toFixed(2).replace(".", ",")}`;

    const expenseDate = new Date(expenseData.date);
    const today = new Date();
    const isContaAPagar = expenseDate > today;

    if (isEditMode && editingExpense) {
      // Modo edição - atualizar despesa existente
      const baseData = {
        date: expenseData.date,
        description: expenseData.category,
        category: expenseData.category,
        value: amount,
        formattedValue,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (isContaAPagar) {
        // Atualizar conta a pagar
        const payable = {
          ...baseData,
          id: `payable-${Date.now()}`,
          dueDate: expenseData.date,
          status: "pending" as const,
          type: "payable" as const,
        };
        updatePayable(payable);
      } else {
        const expense = {
          ...baseData,
          id: `expense-${Date.now()}`,
          type: "expense" as const,
        };
        updateExpense(expense);
      }
    } else {
      // Modo criação - adicionar nova despesa
      const baseData = {
        date: expenseData.date,
        description: expenseData.category,
        category: expenseData.category,
        value: amount,
        formattedValue,
      };

      if (isContaAPagar) {
        // Adicionar conta a pagar
        const payable = {
          ...baseData,
          dueDate: expenseData.date,
          status: "pending" as const,
          type: "payable" as const,
        };
        addPayable(payable);
      } else {
        const expense = {
          ...baseData,
          type: "expense" as const,
        };
        addExpense(expense);
      }
    }

    // Fechar o modal após salvar
    handleCloseExpenseModal();
  };

  // Converter dados do contexto para formato das tabelas
  const formatExpenseData = (expenses: any[]) => {
    return expenses.map((expense) => ({
      id: expense.id,
      date: new Date(expense.date).toLocaleDateString("pt-BR", {
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
    }));
  };

  const formatPayableData = (payables: any[]) => {
    return payables.map((payable) => ({
      id: payable.id,
      date: new Date(payable.dueDate).toLocaleDateString("pt-BR", {
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
    }));
  };

  // Calcular totais
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.value,
    0
  );
  const totalPayables = payables.reduce(
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

  // Dados dinâmicos das tabelas
  const despesasData = formatExpenseData(expenses);
  const contasAPagarData = formatPayableData(payables);

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

    if (expenses.length === 0) {
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
      .filter((cat) => cat.percentage > 0 || expenses.length === 0);
  }, [expenses]);

  // Dados dinâmicos para barras de visão por categoria
  const categoryBarsData = useMemo(() => {
    const predefinedCategories = [
      { name: "Alimentação", color: "#FF6B6B", budget: 500.0 },
      { name: "Transporte", color: "#4ECDC4", budget: 300.0 },
      { name: "Moradia", color: "#45B7D1", budget: 800.0 },
      { name: "Lazer", color: "#96CEB4", budget: 200.0 },
      { name: "Saúde", color: "#FFEAA7", budget: 250.0 },
      { name: "Educação", color: "#DDA0DD", budget: 150.0 },
      { name: "Outros", color: "#98D8C8", budget: 100.0 },
    ];

    // Agrupar despesas por categoria
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach((expense) => {
      const category = expense.category || "Outros";
      categoryTotals[category] =
        (categoryTotals[category] || 0) + expense.value;
    });

    return predefinedCategories
      .map((category) => ({
        name: category.name,
        spent: categoryTotals[category.name] || 0,
        total: category.budget,
        color: category.color,
      }))
      .filter((cat) => cat.spent > 0 || expenses.length === 0);
  }, [expenses]);

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
      {/* Filtro de Mês e Ano */}
      <div className="despesas-header">
        <MonthYearSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          className="header-style"
        />
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
            totalValue="R$ 1.915,60"
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
            totalValue="R$ 1.915,60"
            categories={pieChartData}
            className="despesas-card chart-card"
          />

          {/* Visão por categoria */}
          <div className="despesas-card category-bars-card">
            <h3 className="card-header">Visão por categoria</h3>
            <div className="category-bars">
              {categoryBarsData.map((item, index) => (
                <div key={index} className="category-bar-item">
                  <div className="category-info">
                    <span className="category-name">{item.name}</span>
                    <span className="category-amount">
                      (R$ {item.spent.toFixed(2)} de R$ {item.total.toFixed(2)})
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(item.spent / item.total) * 100}%`,
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
