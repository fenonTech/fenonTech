import React from "react";
import "./CategoryBudgetCard.css";

export interface CategoryBudgetData {
  name: string;
  spent: number;
  planned: number;
  percentage: number;
  percentageOfTotal?: number; // Percentual em relação ao total de todas as categorias
  color: string;
}

interface CategoryBudgetCardProps {
  title?: string;
  data: CategoryBudgetData[];
  emptyMessage?: string;
  className?: string;
}

const CategoryBudgetCard: React.FC<CategoryBudgetCardProps> = ({
  title = "Visão por categoria",
  data,
  emptyMessage = "Nenhum orçamento planejado para este mês",
  className = "",
}) => {
  // Calcular o total geral de todas as categorias
  const totalGeral = data.reduce((acc, item) => acc + item.spent, 0);

  return (
    <div className={`category-budget-card ${className}`}>
      <h3 className="card-header">{title}</h3>
      <div className="category-bars">
        {data.length > 0 ? (
          <>
            {data.map((item, index) => {
              const percentageOfTotal =
                totalGeral > 0 ? (item.spent / totalGeral) * 100 : 0;

              return (
                <div key={index} className="category-bar-item">
                  <div className="category-info">
                    <span className="category-name">{item.name}</span>
                    <span className="category-amount">
                      R$ {item.spent.toFixed(2).replace(".", ",")} (
                      {percentageOfTotal.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentageOfTotal}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
            <div className="category-total-footer">
              Total geral: R$ {totalGeral.toFixed(2).replace(".", ",")}
            </div>
          </>
        ) : (
          <p className="empty-message">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
};

export default CategoryBudgetCard;
