import React, { useState } from "react";
import "./AtualizacaoCadastralMobile.css";
import badgeIcon from "../../../assets/editar.png";

interface AtualizacaoCadastralMobileProps {
  onBack: () => void;
  userName?: string;
  userPhoto?: string;
  userEmail?: string;
  userPhone?: string;
  userDocument?: string;
}

const AtualizacaoCadastralMobile: React.FC<AtualizacaoCadastralMobileProps> = ({
  onBack,
  userName = "Gustavo Gomes do Nascimento",
  userPhoto,
  userEmail = "gustavo@gmail.com",
  userPhone = "(11)91145-1180",
  userDocument = "547.555.930-30",
}) => {
  const [displayName, setDisplayName] = useState(userName.toUpperCase());

  return (
    <div className="atualizacao-cadastral-mobile">
      <div className="atualizacao-cadastral-header">
        <button
          className="atualizacao-back-button"
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
        <h1 className="atualizacao-cadastral-title">Atuliazação Cadastral</h1>
      </div>

      <div className="atualizacao-cadastral-content">
        {/* Profile Section */}
        <div className="atualizacao-profile-section">
          <div className="atualizacao-profile-avatar-wrapper">
            <div className="atualizacao-profile-avatar">
              {userPhoto ? (
                <img src={userPhoto} alt={userName} />
              ) : (
                <div className="atualizacao-profile-avatar-placeholder">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="atualizacao-profile-badge">
              <img
                src={badgeIcon}
                alt="Badge"
                style={{
                  width: "20px",
                  height: "20px",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
          <div className="atualizacao-profile-info">
            <h2 className="atualizacao-profile-name">
              {userName.toUpperCase()}
            </h2>
            <p className="atualizacao-profile-subtitle">
              EXIBIDO APENAS PARA VOCÊ
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="atualizacao-form-section">
          <div className="atualizacao-form-group">
            <label className="atualizacao-form-label">Nome de Exibição</label>
            <input
              type="text"
              className="atualizacao-form-input editable"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="atualizacao-form-group">
            <label className="atualizacao-form-label">E-mail</label>
            <div className="atualizacao-form-value">{userEmail}</div>
          </div>

          <div className="atualizacao-form-group">
            <label className="atualizacao-form-label">Telefone</label>
            <div className="atualizacao-form-value">{userPhone}</div>
          </div>

          <div className="atualizacao-form-group">
            <label className="atualizacao-form-label">Cpf/Cnpj</label>
            <div className="atualizacao-form-value">{userDocument}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtualizacaoCadastralMobile;
