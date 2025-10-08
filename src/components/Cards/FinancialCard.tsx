import React from 'react';
import './FinancialCard.css';

interface FinancialCardProps {
  title: string;
  value: string;
  icon: string;
  type: 'positive' | 'negative' | 'neutral';
  className?: string;
}

const FinancialCard: React.FC<FinancialCardProps> = ({ 
  title, 
  value, 
  icon, 
  type, 
  className = '' 
}) => {
  return (
    <div className={`financial-card ${type} ${className}`}>
      <div className="card-icon">
        <img src={icon} alt={title} />
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{value}</p>
      </div>
    </div>
  );
};

export default FinancialCard;