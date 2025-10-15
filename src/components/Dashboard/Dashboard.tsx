import React from "react";
import "./Dashboard.css";
import FinancialCard from "../Cards/FinancialCard";
import useTabs from "../../hooks/useTabs";
import dinheiroSaldo from "../../assets/dinheiroSaldo.png";
import sacoDeDinheiro from "../../assets/sacoDeDinheiro.png";
import setaParaBaixo from "../../assets/setaParaBaixo.png";

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

  const { activeTab, switchTab } = useTabs("principal");

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

      {/* Sistema de Tabs - apenas no mobile */}
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === "principal" ? "active" : ""}`}
          onClick={() => switchTab("principal")}
        >
          Transações
        </button>
        <button
          className={`tab-button ${activeTab === "graficos" ? "active" : ""}`}
          onClick={() => switchTab("graficos")}
        >
          Gráfico
        </button>
      </div>

      {/* Conteúdo Tab Principal */}
      <div
        className={`tab-content ${activeTab === "principal" ? "active" : ""}`}
      >
        <div className="dashboard-grid">
          {/* Últimas Transações */}
          <div className="dashboard-card">
            <h3 className="card-header">Últimas Transações</h3>
            <div className="table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td>{transaction.date}</td>
                      <td>{transaction.description}</td>
                      <td>
                        <span className={`category ${transaction.type}`}>
                          {transaction.category}
                        </span>
                      </td>
                      <td className={`value ${transaction.type}`}>
                        {transaction.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contas a pagar */}
          <div className="dashboard-card">
            <h3 className="card-header">Contas a pagar</h3>
            <div className="bills-container">
              <div className="bills-icon">
                <img src={sacoDeDinheiro} alt="Contas" />
              </div>
              <div className="table-container">
                <table className="bills-table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Descrição</th>
                      <th>Categoria</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((bill, index) => (
                      <tr key={index}>
                        <td>{bill.date}</td>
                        <td>{bill.description}</td>
                        <td>
                          <span className="category expense">
                            {bill.category}
                          </span>
                        </td>
                        <td className="value expense">{bill.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Tab Gráficos */}
      <div
        className={`tab-content ${activeTab === "graficos" ? "active" : ""}`}
      >
        <div className="dashboard-grid">
          {/* Despesas por categoria (simulando gráfico de pizza) */}
          <div className="dashboard-card">
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
