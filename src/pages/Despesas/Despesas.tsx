import React from "react";
import "./Despesas.css";
import FinancialCard from "../../components/Cards/FinancialCard";
import TransactionTable from "../../components/TransactionTable";
import type { TableColumn } from "../../components/TransactionTable";
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
      {/* Cards principais */}
      <div className="despesas-cards">
        <FinancialCard
          title="Despesas do mês"
          value="R$ 1.185,70"
          icon={carteiraCardDespesasdoMês}
          type="negative"
          className="despesa-card-large"
        />
        <FinancialCard
          title="Contas a pagar"
          value="R$ 729,90"
          icon={simboloMenuBolsoContasAPagar}
          type="neutral"
          className="despesa-card-large"
        />
      </div>

      {/* Conteúdo principal */}
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
          <div className="despesas-card chart-card">
            <h3 className="card-header">Despesas por categoria</h3>
            <div className="chart-container">
              <div className="chart-placeholder">
                <div className="chart-center">
                  <div className="total-label">TOTAL DESPESAS</div>
                  <div className="total-value">R$ 1.915,60</div>
                </div>
              </div>
              <div className="chart-legend">
                {pieChartData.map((item, index) => (
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
