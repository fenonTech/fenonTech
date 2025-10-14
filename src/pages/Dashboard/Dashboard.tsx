import React from "react";
import "./Dashboard.css";
import FinancialCard from "../../components/Cards/FinancialCard";
import TransactionTable from "../../components/TransactionTable";
import type { TableColumn } from "../../components/TransactionTable";
import useTabs from "../../hooks/useTabs";
import useFinancialCardNavigation from "../../hooks/useFinancialCardNavigation";
import { useBalanceVisibility } from "../../hooks/useBalanceVisibility";
import dinheiroSaldo from "../../assets/dinheiroSaldo.png";
import sacoDeDinheiro from "../../assets/sacoDeDinheiro.png";
import setaParaBaixo from "../../assets/setaParaBaixo.png";
import simboloMenuBolsoContasAPagar from "../../assets/simboloMenuBolsoContasAPagar.png";

interface Transaction {
  date: string;
  description: string;
  category: string;
  value: string;
  type: "income" | "expense";
}

interface Bill {
  date: string;
  description: string;
  category: string;
  value: string;
}

const Dashboard: React.FC = () => {
  const transactions: Transaction[] = [
    {
      date: "31/10",
      description: "iFood",
      category: "Alimentação",
      value: "R$ 50,00",
      type: "expense",
    },
    {
      date: "31/10",
      description: "iFood",
      category: "Alimentação",
      value: "R$ 50,00",
      type: "expense",
    },
    {
      date: "31/10",
      description: "iFood",
      category: "Alimentação",
      value: "R$ 50,00",
      type: "expense",
    },
    {
      date: "31/10",
      description: "iFood",
      category: "Alimentação",
      value: "R$ 50,00",
      type: "expense",
    },
    {
      date: "31/10",
      description: "iFood",
      category: "Alimentação",
      value: "R$ 50,00",
      type: "expense",
    },
  ];

  const bills: Bill[] = [
    {
      date: "31/10",
      description: "iFood",
      category: "Alimentação",
      value: "R$ 50,00",
    },
    {
      date: "31/10",
      description: "iFood",
      category: "Alimentação",
      value: "R$ 50,00",
    },
    {
      date: "31/10",
      description: "iFood",
      category: "Alimentação",
      value: "R$ 50,00",
    },
    {
      date: "31/10",
      description: "iFood",
      category: "Alimentação",
      value: "R$ 50,00",
    },
    {
      date: "31/10",
      description: "iFood",
      category: "Alimentação",
      value: "R$ 50,00",
    },
    {
      date: "31/10",
      description: "iFood",
      category: "Alimentação",
      value: "R$ 50,00",
    },
    {
      date: "31/10",
      description: "iFood",
      category: "Alimentação",
      value: "R$ 50,00",
    },
    {
      date: "31/10",
      description: "iFood",
      category: "Alimentação",
      value: "R$ 50,00",
    },
  ];

  const categoryData = [
    { name: "iFood", percentage: 40, color: "#FF6B6B" },
    { name: "Uber", percentage: 30, color: "#4ECDC4" },
    { name: "Aluguel", percentage: 20, color: "#45B7D1" },
    { name: "Despesas Fixas", percentage: 35, color: "#96CEB4" },
    { name: "Contas Variáveis", percentage: 25, color: "#FFEAA7" },
  ];

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

  const { activeTab, switchTab } = useTabs("principal");
  const { activeCard, switchCard, cardData } =
    useFinancialCardNavigation("saldo");
  const { isBalanceVisible, toggleBalanceVisibility, formatValue } =
    useBalanceVisibility();

  const getCardIcon = () => {
    switch (activeCard) {
      case "saldo":
        return dinheiroSaldo;
      case "receita":
        return sacoDeDinheiro;
      case "despesa":
        return setaParaBaixo;
      default:
        return dinheiroSaldo;
    }
  };

  return (
    <div className="dashboard">
      {/* Cards Originais - DESKTOP */}
      <div className="financial-cards">
        <FinancialCard
          title="Saldo Atual"
          value={formatValue("R$ 1.250,37")}
          icon={dinheiroSaldo}
          type="neutral"
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
        <FinancialCard
          title="Receita do mês"
          value={formatValue("R$ 2.850,00")}
          icon={sacoDeDinheiro}
          type="positive"
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
        <FinancialCard
          title="Despesas do mês"
          value={formatValue("R$ 1.599,63")}
          icon={setaParaBaixo}
          type="negative"
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
      </div>

      {/* Sistema de Navegação - APENAS MOBILE */}
      <div className="financial-card-container">
        {/* Navegação dos Cards */}
        <div className="financial-card-navigation">
          <button
            className={`nav-button ${activeCard === "saldo" ? "active" : ""}`}
            onClick={() => switchCard("saldo")}
          >
            Saldo
          </button>
          <button
            className={`nav-button ${activeCard === "receita" ? "active" : ""}`}
            onClick={() => switchCard("receita")}
          >
            Receita
          </button>
          <button
            className={`nav-button ${activeCard === "despesa" ? "active" : ""}`}
            onClick={() => switchCard("despesa")}
          >
            Despesa
          </button>
        </div>

        {/* Card Único */}
        <div className="single-financial-card">
          <FinancialCard
            title={cardData.title}
            value={formatValue(cardData.value)}
            icon={getCardIcon()}
            type={cardData.type}
            showToggle={true}
            isBalanceVisible={isBalanceVisible}
            onToggleVisibility={toggleBalanceVisibility}
          />
        </div>
      </div>

      {/* Sistema de Tabs - apenas no mobile */}
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === "principal" ? "active" : ""}`}
          onClick={() => switchTab("principal")}
        >
          Principal
        </button>
        <button
          className={`tab-button ${activeTab === "graficos" ? "active" : ""}`}
          onClick={() => switchTab("graficos")}
        >
          Análise
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
            data={transactions}
            className="transactions-card"
            showSummary={true}
            summaryCountLabel="Transações"
            valueKey="value"
          />

          {/* Despesas por categoria (gráfico de pizza) */}
          <div className="dashboard-card expenses-chart-card">
            <h3 className="card-header">Despesas por categoria</h3>
            <div className="chart-container">
              <div className="chart-placeholder">
                <div className="chart-center">
                  <div className="total-label">TOTAL DESPESAS</div>
                  <div className="total-value">R$ 6.749,63</div>
                </div>
              </div>
              <div className="chart-legend">
                {categoryData.map((item, index) => (
                  <div key={index} className="legend-item">
                    <div
                      className="legend-color"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="legend-label">
                      {item.name} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
      >
        <div className="dashboard-grid">
          {/* Últimas Transações */}
          <TransactionTable
            title="Últimas Transações"
            columns={transactionColumns}
            data={transactions}
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
      >
        <div className="dashboard-grid">
          {/* Despesas por categoria (simulando gráfico de pizza) */}
          <div className="dashboard-card expenses-chart-card">
            <h3 className="card-header">Despesas por categoria</h3>
            <div className="chart-container">
              <div className="chart-placeholder">
                <div className="chart-center">
                  <div className="total-label">TOTAL DESPESAS</div>
                  <div className="total-value">R$ 6.749,63</div>
                </div>
              </div>
              <div className="chart-legend">
                {categoryData.map((item, index) => (
                  <div key={index} className="legend-item">
                    <div
                      className="legend-color"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="legend-label">
                      {item.name} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
