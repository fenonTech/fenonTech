import React from "react";
import "./NotificacoesMobile.css";

interface NotificacoesMobileProps {
  onBack: () => void;
}

const NotificacoesMobile: React.FC<NotificacoesMobileProps> = ({ onBack }) => {
  return (
    <div className="notificacoes-mobile">
      <div className="notificacoes-mobile-header">
        <button
          className="notif-back-button"
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
        <h1 className="notificacoes-mobile-title">Notificações</h1>
      </div>

      <div className="notificacoes-mobile-content">
        <div className="notificacoes-card">
          <p className="coming-soon">Em breve...</p>
        </div>
      </div>
    </div>
  );
};

export default NotificacoesMobile;
