import React from "react";
import "./SessionExpired.css";

const SessionExpired: React.FC = () => {
  const handleNewSession = () => {
    // Limpar credenciais do localStorage
    localStorage.removeItem("fenontech-telefone");
    localStorage.removeItem("fenontech-codigoTemp");

    // Redirecionar para login
    window.location.href =
      "https://landing-page-gbprzvx9a-fenontechs-projects.vercel.app/login";
  };

  return (
    <div className="session-expired-container">
      <div className="session-expired-card">
        <div className="session-expired-icon">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="#FF6B6B" strokeWidth="2" />
            <path
              d="M12 7v5M12 16h.01"
              stroke="#FF6B6B"
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
          Gerar Nova Sessão
        </button>

        <p className="session-expired-info">
          Você será redirecionado para a página de login
        </p>
      </div>
    </div>
  );
};

export default SessionExpired;
