import React from "react";
import "./Despesas.css";
import FinancialCard from "../../components/Cards/FinancialCard";
import carteiraCardDespesasdoMês from "../../assets/carteiraCardDespesasdoMês.png";
import simboloMenuBolsoContasAPagar from "../../assets/simboloMenuBolsoContasAPagar.png";

interface DespesaEntry {
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
      value: "R$ 5.000,00",
    },
    { date: "10/10", category: "Contas", type: "Fixa", value: "R$ 550,00" },
  ];

  // Dados para o gráfico de pizza
  const pieChartData = [
    { name: "Moradia", percentage: 30, color: "#4ECDC4" },
    { name: "Moradia", percentage: 25, color: "#FFD700" },
    { name: "Alimentação", percentage: 20, color: "#FF6B6B" },
    { name: "Transporte", percentage: 15, color: "#45B7D1" },
    { name: "Saúde", percentage: 5, color: "#96CEB4" },
    { name: "Contas", percentage: 3, color: "#FFEAA7" },
    { name: "Educação", percentage: 2, color: "#A8E6CF" },
  ];

  // Dados para barras de visão por categoria
  const categoryBarsData = [
    { name: "iFood", spent: 40.0, total: 100.0, color: "#FF6B6B" },
    { name: "Uber", spent: 10.0, total: 85.0, color: "#4ECDC4" },
    { name: "Roupas", spent: 5.0, total: 80.0, color: "#45B7D1" },
    { name: "Despesas Fixas", spent: 0.0, total: 100.0, color: "#96CEB4" },
    { name: "Contas Variáveis", spent: 0.0, total: 100.0, color: "#FFEAA7" },
  ];

  return (
    <div className="despesas-page">
      {/* Cards principais */}
      <div className="despesas-cards">
        <FinancialCard
          title="Despesas do mês"
          value="R$ 1.250,37"
          icon={carteiraCardDespesasdoMês}
          type="negative"
          className="despesa-card-large"
        />
        <FinancialCard
          title="Contas a pagar"
          value="R$ 600,00"
          icon={simboloMenuBolsoContasAPagar}
          type="neutral"
          className="despesa-card-large"
        />
      </div>

      {/* Conteúdo principal */}
      <div className="despesas-content">
        {/* Últimas Saídas */}
        <div className="despesas-card">
          <h3 className="card-header">Últimas saídas</h3>
          <div className="saidas-summary">
            <div className="summary-item">
              <span className="summary-label">Data</span>
              <span className="summary-label">Categoria</span>
              <span className="summary-label">Tipo</span>
              <span className="summary-label">Valor</span>
            </div>
            {despesasData.map((entry, index) => (
              <div key={index} className="summary-item">
                <span className="summary-date">{entry.date}</span>
                <span className="summary-category">{entry.category}</span>
                <span className={`summary-type ${entry.type.toLowerCase()}`}>
                  {entry.type}
                </span>
                <span className="summary-value expense">{entry.value}</span>
              </div>
            ))}
            <div className="summary-footer">
              <span className="entries-count">Saídas: 2</span>
              <span className="entries-total">Total: R$ 3.550,00</span>
            </div>
          </div>
        </div>

        {/* Despesas por categoria - Gráfico de Pizza */}
        <div className="despesas-card chart-card">
          <h3 className="card-header">Despesas por categoria</h3>
          <div className="pie-chart-container">
            <div className="pie-chart">
              <div className="pie-chart-circle">
                <div className="pie-center">
                  <div className="total-label">TOTAL DESPESAS</div>
                  <div className="total-value">R$ 6.749,63</div>
                </div>
              </div>
            </div>
            <div className="pie-legend">
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
        <div className="despesas-card full-width">
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
  );
};

export default Despesas;
