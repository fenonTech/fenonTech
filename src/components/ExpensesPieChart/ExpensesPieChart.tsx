import React from "react";
import "./ExpensesPieChart.css";

interface ExpenseCategory {
  name: string;
  percentage: number;
  color: string;
}

interface ExpensesPieChartProps {
  title?: string;
  totalLabel?: string;
  totalValue: string;
  categories: ExpenseCategory[];
  className?: string;
}

const ExpensesPieChart: React.FC<ExpensesPieChartProps> = ({
  title = "Despesas por categoria",
  totalLabel = "TOTAL DESPESAS",
  totalValue,
  categories,
  className = "",
}) => {
  return (
    <div className={`expenses-pie-chart ${className}`}>
      <h3 className="card-header">{title}</h3>
      <div className="chart-container">
        <div className="chart-placeholder">
          <div className="chart-center">
            <div className="total-label">{totalLabel}</div>
            <div className="total-value">{totalValue}</div>
          </div>
        </div>
        <div className="chart-legend">
          {categories.map((item, index) => (
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
  );
};

export default ExpensesPieChart;
