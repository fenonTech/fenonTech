import React from "react";
import { APP_URLS } from "../../config";
import { authService } from "../../services/authService";
import "./SessionExpired.css";
import logo from "../../assets/logo.png";

const SessionExpired: React.FC = () => {
  const handleNewSession = () => {
    // Limpar todas as credenciais usando authService
    authService.clearUserCredentials();
    localStorage.removeItem("fenontech-session-expired");
    localStorage.removeItem("fenontech-subscription-expired");

    // Redirecionar para login
    window.location.href = APP_URLS.LOGIN;
  };

  return (
    <div className="session-expired-page">
      <header className="session-expired-header">
        <img src={logo} alt="Meu Bolso" className="session-expired-logo" />
        <span className="session-expired-brand">Meu Bolso</span>
      </header>

      <div className="session-expired-content">
        <div className="session-expired-icon">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="#ffd700" strokeWidth="1.5" />
            <path
              d="M12 8v4M12 16h.01"
              stroke="#ffd700"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="session-expired-title">Sessão Expirada</h1>

        <p className="session-expired-message">
          Sua sessão expirou por motivos de segurança.
          <br />
          Por favor, faça login novamente para continuar.
        </p>

        <button className="session-expired-button" onClick={handleNewSession}>
          Fazer Login
        </button>
      </div>
    </div>
  );
};

export default SessionExpired;
