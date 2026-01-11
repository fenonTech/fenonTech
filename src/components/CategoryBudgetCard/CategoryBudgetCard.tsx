import React from "react";
import "./CategoryBudgetCard.css";

export interface CategoryBudgetData {
  name: string;
  spent: number;
  planned: number;
  percentage: number;
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
  return (
    <div className={`category-budget-card ${className}`}>
      <h3 className="card-header">{title}</h3>
      <div className="category-bars">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="category-bar-item">
              <div className="category-info">
                <span className="category-name">{item.name}</span>
                <span className="category-amount">
                  (R$ {item.spent.toFixed(2).replace(".", ",")} de R${" "}
                  {item.planned.toFixed(2).replace(".", ",")})
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
          ))
        ) : (
          <p className="empty-message">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
};

export default CategoryBudgetCard;
