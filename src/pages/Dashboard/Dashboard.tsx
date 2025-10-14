import React from "react";
import "./Dashboard.css";
import FinancialCard from "../../components/Cards/FinancialCard";
import TransactionTable from "../../components/TransactionTable";
import type { TableColumn } from "../../components/TransactionTable";
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
    {
      date: "31/10",
      description: "iFood",
      category: "Alimentação",
      value: "R$ 50,00",
      type: "expense",
    },
    {
      date: "28/10",
      description: "Uber",
      category: "Locomoção",
      value: "R$ 30,00",
      type: "expense",
    },
    {
      date: "27/10",
      description: "Aluguel",
      category: "Despesa Fixa",
      value: "R$ 50,00",
      type: "expense",
    },
    {
      date: "26/10",
      description: "Desenvolvimento Sistema",
      category: "Entrada",
      value: "R$ 50,00",
      type: "income",
    },
    {
      date: "25/10",
      description: "Empréstimo",
      category: "Despesa Variável",
      value: "R$ 50,00",
      type: "expense",
    },
    {
      date: "24/10",
      description: "Freelancer",
      category: "Entrada",
      value: "R$ 50,00",
      type: "income",
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
  ];

  const categoryData = [
    { name: "iFood", percentage: 40, color: "#FF6B6B" },
    { name: "Uber", percentage: 30, color: "#4ECDC4" },
    { name: "Aluguel", percentage: 20, color: "#45B7D1" },
    { name: "Despesas Fixas", percentage: 35, color: "#96CEB4" },
    { name: "Contas Variáveis", percentage: 25, color: "#FFEAA7" },
  ];

  // Definir colunas para a tabela de transações
  const transactionColumns: TableColumn[] = [
    { key: "date", label: "Data" },
    { key: "description", label: "Descrição" },
    {
      key: "category",
      label: "Categoria",
      render: (value, row) => (
        <span className={`category ${row.type}`}>{value}</span>
      ),
    },
    {
      key: "value",
      label: "Valor",
      render: (value, row) => (
        <span className={`value ${row.type}`}>{value}</span>
      ),
    },
  ];

  // Definir colunas para a tabela de contas a pagar
  const billsColumns: TableColumn[] = [
    { key: "date", label: "Data" },
    { key: "description", label: "Descrição" },
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

  return (
    <div className="dashboard">
      {/* Cards principais */}
      <div className="financial-cards">
        <FinancialCard
          title="Saldo Atual"
          value="R$ 1.250,37"
          icon={dinheiroSaldo}
          type="neutral"
        />
        <FinancialCard
          title="Receita do mês"
          value="R$ 1.250,37"
          icon={sacoDeDinheiro}
          type="positive"
        />
        <FinancialCard
          title="Despesas do mês"
          value="R$ 6.749,64"
          icon={setaParaBaixo}
          type="negative"
        />
      </div>

      {/* Seção de gráficos e tabelas */}
      {/* Primeira linha com cards específicos */}
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
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#FF6B6B" }}
                ></div>
                <span className="legend-label">Alimentação (35%)</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#4ECDC4" }}
                ></div>
                <span className="legend-label">Transporte (25%)</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#45B7D1" }}
                ></div>
                <span className="legend-label">Moradia (30%)</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#96CEB4" }}
                ></div>
                <span className="legend-label">Outros (10%)</span>
              </div>
              ={" "}
            </div>
          </div>
        </div>
      </div>

      {/* Segunda linha com outros cards */}
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
  );
};

export default Dashboard;
