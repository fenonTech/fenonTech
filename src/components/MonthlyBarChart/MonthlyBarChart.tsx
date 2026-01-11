import React from "react";
import "./MonthlyBarChart.css";

export interface MonthlyData {
  month: string;
  value: number;
}

interface MonthlyBarChartProps {
  title?: string;
  data: MonthlyData[];
  formatValue?: (value: number) => string;
  className?: string;
}

const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({
  title = "Gráfico Mensal",
  data,
  formatValue = (value) => `R$ ${value.toFixed(2).replace(".", ",")}`,
  className = "",
}) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className={`monthly-bar-chart-card ${className}`}>
      <h3 className="card-header">{title}</h3>
      <div className="chart-container">
        <div className="bar-chart">
          {data.map((item, index) => (
            <div key={index} className="bar-item">
              <div className="bar-wrapper">
                <div
                  className="bar"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    opacity: item.value === 0 ? 0.3 : 1,
                  }}
                  title={`${item.month}: ${formatValue(item.value)}`}
                >
                  <span className="bar-tooltip">{formatValue(item.value)}</span>
                </div>
              </div>
              <span className="bar-label">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyBarChart;
