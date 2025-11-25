import React from "react";
import "./SessionExpired.css";

const SessionExpired: React.FC = () => {
  const handleNewSession = () => {
    // Limpar credenciais do localStorage
    localStorage.removeItem("fenontech-telefone");
    localStorage.removeItem("fenontech-codigoTemp");

    // Redirecionar para login
    window.location.href = "https://www.fenontech.com.br/login";
  };

  return (
    <div className="session-expired-page">
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
