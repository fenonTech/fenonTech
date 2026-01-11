import React, { useState } from "react";
import "./NotificacoesMobile.css";

interface NotificacoesMobileProps {
  onBack: () => void;
}

interface NotificationSetting {
  id: string;
  label: string;
  enabled: boolean;
}

const NotificacoesMobile: React.FC<NotificacoesMobileProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    { id: "lembretes", label: "Lembrestes de lançamento", enabled: true },
    { id: "relatorios1", label: "Relatórios Diários", enabled: true },
    { id: "relatorios2", label: "Relatórios Diários", enabled: false },
    { id: "relatorios3", label: "Relatórios Diários", enabled: true },
  ]);

  const handleToggle = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

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
          {settings.map((setting) => (
            <div key={setting.id} className="notificacao-item">
              <span className="notificacao-label">{setting.label}</span>
              <button
                className={`notificacao-toggle ${
                  setting.enabled ? "active" : ""
                }`}
                onClick={() => handleToggle(setting.id)}
                aria-label={`${setting.enabled ? "Desativar" : "Ativar"} ${
                  setting.label
                }`}
              >
                <span className="toggle-slider" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificacoesMobile;
