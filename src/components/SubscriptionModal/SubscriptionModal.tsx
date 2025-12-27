import React from "react";
import "./SubscriptionModal.css";
import logo from "../../assets/logo.png";

interface SubscriptionModalProps {
  isOpen: boolean;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen }) => {
  const handleRenewSubscription = () => {
    // Redirecionar para página de planos
    window.location.href =
      "https://www.fenontech.com.br/landingpage/index.html#/planos";
  };

  if (!isOpen) return null;

  return (
    <div className="subscription-modal-overlay">
      <div className="subscription-modal-content">
        <div className="subscription-modal-header">
          <img src={logo} alt="Meu Bolso" className="subscription-modal-logo" />
          <span className="subscription-modal-brand">Meu Bolso</span>
        </div>

        <div className="subscription-modal-body">
          <div className="subscription-modal-icon">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#ffd700"
                strokeWidth="1.5"
              />
              <path
                d="M12 6v6l4 2"
                stroke="#ffd700"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="subscription-modal-title">Assinatura Expirada</h1>

          <p className="subscription-modal-message">
            Para continuar aproveitando todos os recursos do
            <strong style={{ color: "#ffd700" }}> Meu Bolso</strong>, renove
            agora e mantenha suas finanças sempre organizadas.
          </p>

          <button
            className="subscription-modal-button"
            onClick={handleRenewSubscription}
          >
            <span className="button-icon">🚀</span>
            Renovar Minha Assinatura
          </button>

          <p className="subscription-modal-subtitle">
            Continue aproveitando todos os benefícios do Meu Bolso
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
