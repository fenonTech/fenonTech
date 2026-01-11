import React from "react";
import "./ConfiguracoesMobile.css";

interface ConfiguracoesMobileProps {
  userName: string;
  userPhoto?: string;
  onBack: () => void;
  onNavigate?: (screen: "notificacoes" | "pagamentos" | "atualizacao") => void;
}

const ConfiguracoesMobile: React.FC<ConfiguracoesMobileProps> = ({
  userName,
  userPhoto,
  onBack,
  onNavigate,
}) => {
  const handleNotifications = () => {
    if (onNavigate) {
      onNavigate("notificacoes");
    }
  };

  const handlePayments = () => {
    if (onNavigate) {
      onNavigate("pagamentos");
    }
  };

  const handleProfileUpdate = () => {
    if (onNavigate) {
      onNavigate("atualizacao");
    }
  };

  return (
    <div className="configuracoes-mobile">
      <div className="configuracoes-mobile-header">
        <button
          className="config-back-button"
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
        <h1 className="configuracoes-mobile-title">Perfil</h1>
      </div>

      <div className="configuracoes-mobile-content">
        <div className="config-profile-section">
          <div className="config-profile-avatar">
            {userPhoto ? (
              <img src={userPhoto} alt={userName} />
            ) : (
              <div className="config-profile-avatar-placeholder">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h2 className="config-profile-name">{userName.toUpperCase()}</h2>
          <p className="config-profile-subtitle">EXIBIDO APENAS PARA VOCÊ</p>
        </div>

        <div className="config-menu-section">
          <button className="config-menu-item" onClick={handleNotifications}>
            <div className="config-menu-item-content">
              <svg
                className="config-menu-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="config-menu-text">Notificações</span>
            </div>
            <svg
              className="config-menu-arrow"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button className="config-menu-item" onClick={handlePayments}>
            <div className="config-menu-item-content">
              <svg
                className="config-menu-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="6"
                  width="20"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="config-menu-text">Pagamentos</span>
            </div>
            <svg
              className="config-menu-arrow"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button className="config-menu-item" onClick={handleProfileUpdate}>
            <div className="config-menu-item-content">
              <svg
                className="config-menu-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="config-menu-text">Atualização Cadastral</span>
            </div>
            <svg
              className="config-menu-arrow"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesMobile;
