import React from "react";
import "./SubscriptionError.css";
import logo from "../../assets/logo.png";

const SubscriptionError: React.FC = () => {
  const handleRenewSubscription = () => {
    // Redirecionar para página de renovação/pagamento
    window.location.href =
      "https://www.fenontech.com.br/landingpage/index.html#/renovar";
  };

  return (
    <div className="subscription-error-page">
      <header className="subscription-error-header">
        <img src={logo} alt="Meu Bolso" className="subscription-error-logo" />
        <span className="subscription-error-brand">Meu Bolso</span>
      </header>

      <div className="subscription-error-content">
        <div className="subscription-error-icon">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="#ff6b6b" strokeWidth="1.5" />
            <path
              d="M8 12h8M12 8v8"
              stroke="#ff6b6b"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M15 9l-6 6M9 9l6 6"
              stroke="#ff6b6b"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="subscription-error-title">Assinatura Expirada</h1>

        <p className="subscription-error-message">
          Sua assinatura expirou e você precisa renovar para continuar usando o
          Meu Bolso.
          <br />
          <strong>Renove agora e continue controlando suas finanças!</strong>
        </p>

        <div className="subscription-error-features">
          <div className="feature-item">
            <span className="feature-icon">💰</span>
            <span>Controle total das finanças</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span>Relatórios detalhados</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span>Metas e planejamento</span>
          </div>
        </div>

        <button
          className="subscription-error-button"
          onClick={handleRenewSubscription}
        >
          <span className="button-icon">🚀</span>
          Renovar Assinatura
        </button>

        <p className="subscription-error-subtitle">
          Continue aproveitando todos os benefícios do Meu Bolso
        </p>
      </div>
    </div>
  );
};

export default SubscriptionError;
