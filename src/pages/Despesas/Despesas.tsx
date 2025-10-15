import React from "react";
import "./Despesas.css";
import FinancialCard from "../../components/Cards/FinancialCard";
import MobileFinancialCard from "../../components/MobileFinancialCard";
import TransactionTable from "../../components/TransactionTable";
import type { TableColumn } from "../../components/TransactionTable";
import ExpensesPieChart from "../../components/ExpensesPieChart";
import useDespesasNavigation from "../../hooks/useDespesasNavigation";
import useTabs from "../../hooks/useTabs";
import { useBalanceVisibility } from "../../hooks/useBalanceVisibility";
import carteiraCardDespesasdoMês from "../../assets/carteiraCardDespesasdoMês.png";
import simboloMenuBolsoContasAPagar from "../../assets/simboloMenuBolsoContasAPagar.png";

interface DespesaEntry {
  date: string;
  category: string;
  type: string;
  value: string;
}

interface ContasAPagarEntry {
  date: string;
  category: string;
  type: string;
  value: string;
}

const Despesas: React.FC = () => {
  const { activeCard, switchCard } = useDespesasNavigation("despesas");
  const { activeTab, switchTab } = useTabs("graficos");
  const { isBalanceVisible, toggleBalanceVisibility, formatValue } =
    useBalanceVisibility();

  // Configuração das opções do card mobile
  const mobileCardOptions = [
    {
      key: "despesas",
      label: "Despesas",
      title: "Despesas do mês",
      value: "R$ 1.185,70",
      icon: carteiraCardDespesasdoMês,
      type: "negative" as const,
    },
    {
      key: "contas",
      label: "Contas a Pagar",
      title: "Contas a pagar",
      value: "R$ 890,50",
      icon: simboloMenuBolsoContasAPagar,
      type: "negative" as const,
    },
  ];

  const despesasData: DespesaEntry[] = [
    {
      date: "06/10",
      category: "iFood",
      type: "Variável",
      value: "R$ 85,50",
    },
    {
      date: "10/10",
      category: "Combustível",
      type: "Variável",
      value: "R$ 120,00",
    },
    {
      date: "12/10",
      category: "Supermercado",
      type: "Variável",
      value: "R$ 250,30",
    },
  ];

  const contasAPagarData: ContasAPagarEntry[] = [
    {
      date: "15/10",
      category: "Energia Elétrica",
      type: "Fixa",
      value: "R$ 180,00",
    },
    {
      date: "20/10",
      category: "Internet",
      type: "Fixa",
      value: "R$ 99,90",
    },
    {
      date: "25/10",
      category: "Cartão de Crédito",
      type: "Variável",
      value: "R$ 450,00",
    },
  ];

  // Dados para o gráfico de pizza
  const pieChartData = [
    { name: "Alimentação", percentage: 35, color: "#FF6B6B" },
    { name: "Transporte", percentage: 25, color: "#4ECDC4" },
    { name: "Moradia", percentage: 30, color: "#45B7D1" },
    { name: "Outros", percentage: 10, color: "#96CEB4" },
  ];

  // Dados para barras de visão por categoria
  const categoryBarsData = [
    { name: "Alimentação", spent: 355.8, total: 500.0, color: "#FF6B6B" },
    { name: "Transporte", spent: 120.0, total: 300.0, color: "#4ECDC4" },
    { name: "Contas Fixas", spent: 729.9, total: 800.0, color: "#45B7D1" },
    { name: "Lazer", spent: 85.0, total: 200.0, color: "#96CEB4" },
    { name: "Outros", spent: 150.0, total: 250.0, color: "#FFEAA7" },
  ];

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
      {/* Sistema de Navegação Integrado - APENAS MOBILE */}
      <MobileFinancialCard
        navigationOptions={mobileCardOptions}
        activeCard={activeCard}
        onCardSwitch={(cardKey) => switchCard(cardKey as any)}
        className="despesas-mobile-card"
      />

      {/* Cards principais - Desktop */}
      <div className="despesas-cards desktop-content">
        <FinancialCard
          title="Despesas do mês"
          value={formatValue("R$ 1.185,70")}
          icon={carteiraCardDespesasdoMês}
          type="negative"
          className="despesa-card-large"
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
        <FinancialCard
          title="Contas a pagar"
          value={formatValue("R$ 729,90")}
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
    </div>
  );
};

export default Despesas;
