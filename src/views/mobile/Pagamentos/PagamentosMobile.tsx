import React from "react";
import "./PagamentosMobile.css";

interface PagamentosMobileProps {
  onBack: () => void;
}

interface Payment {
  id: string;
  planName: string;
  amount: number;
  date: string;
}

const PagamentosMobile: React.FC<PagamentosMobileProps> = ({ onBack }) => {
  // Dados do plano atual
  const currentPlan = {
    name: "Plano Inteligente",
    expiryDate: "15/01/2026",
    daysRemaining: 12,
  };

  // Histórico de pagamentos
  const payments: Payment[] = [
    {
      id: "1",
      planName: "Plano Inteligente",
      amount: 50.0,
      date: "31/10/2024",
    },
    {
      id: "2",
      planName: "Plano Inteligente",
      amount: 50.0,
      date: "31/10/2024",
    },
    {
      id: "3",
      planName: "Plano Inteligente",
      amount: 50.0,
      date: "31/10/2024",
    },
    { id: "4", planName: "Plano Essencial", amount: 50.0, date: "31/10/2024" },
    { id: "5", planName: "Plano Essencial", amount: 50.0, date: "31/10/2024" },
  ];

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="pagamentos-mobile">
      <div className="pagamentos-mobile-header">
        <button
          className="pagamentos-back-button"
          onClick={onBack}
          aria-label="Voltar"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="pagamentos-mobile-title">Pagamentos</h1>
      </div>

      <div className="pagamentos-mobile-content">
        {/* Card do Plano Atual */}
        <div className="current-plan-card">
          <h2 className="current-plan-name">{currentPlan.name}</h2>
          <div className="current-plan-info">
            <div className="plan-info-item">
              <span className="plan-info-label">Vence Em:</span>
              <span className="plan-info-value highlight">
                {currentPlan.expiryDate}
              </span>
            </div>
            <div className="plan-info-item">
              <span className="plan-info-label">Restam:</span>
              <span className="plan-info-value highlight">
                {currentPlan.daysRemaining} Dias
              </span>
            </div>
          </div>
        </div>

        {/* Últimos Pagamentos */}
        <div className="payment-history-section">
          <h3 className="payment-history-title">Últimos Pagamentos</h3>

          <div className="payment-list">
            {payments.map((payment) => (
              <div key={payment.id} className="payment-item">
                <div className="payment-item-left">
                  <svg
                    className="payment-icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      stroke="#FFD700"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  <span className="payment-plan-name">{payment.planName}</span>
                </div>
                <div className="payment-item-right">
                  <span className="payment-amount">
                    {formatCurrency(payment.amount)}
                  </span>
                  <span className="payment-date">{payment.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagamentosMobile;
