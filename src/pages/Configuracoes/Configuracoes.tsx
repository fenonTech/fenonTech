import React, { useState } from 'react';
import './Configuracoes.css';
import simboloMeuBolsoUsadoNoCardDePerfilDoUsuario from '../../assets/simboloMeuBolsoUsadoNoCardDePerfilDoUsuario.png';
import simboloMeuBolsoUtilizadoNoCardDeNotificacoes from '../../assets/simboloMeuBolsoUtilizadoNoCardDeNotificacoes.png';
import SimboloMeuBolsoUtilizadoNoCardDeBancosConectados from '../../assets/SimboloMeuBolsoUtilizadoNoCardDeBancosConectados.png';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const Configuracoes: React.FC = () => {
  const [userProfile, setUserProfile] = useState({
    nomeCompleto: 'Rafael',
    email: 'rael@gmail.com',
    entradaMensal: 'R$2000'
  });

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'transacoes1',
      label: 'E-mail de transações',
      description: 'Receba alertas de novas transações',
      enabled: true
    },
    {
      id: 'transacoes2',
      label: 'E-mail de transações',
      description: 'Receba alertas de novas transações',
      enabled: true
    },
    {
      id: 'transacoes3',
      label: 'E-mail de transações',
      description: 'Receba alertas de novas transações',
      enabled: false
    },
    {
      id: 'transacoes4',
      label: 'E-mail de transações',
      description: 'Receba alertas de novas transações',
      enabled: true
    }
  ]);

  const bancos = [
    {
      id: 'nubank',
      name: 'Nubank',
      logo: '🟣', // Placeholder, você pode substituir por ícones reais
      color: '#8A05BE'
    },
    {
      id: 'itau',
      name: 'Itaú',
      logo: '🟠',
      color: '#EC7000'
    },
    {
      id: 'pix',
      name: 'PIX',
      logo: '🟢',
      color: '#32BCAD'
    }
  ];

  const handleProfileChange = (field: string, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationToggle = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    );
  };

  const handleSaveChanges = () => {
    console.log('Salvando alterações...', userProfile);
    // Aqui você pode implementar a lógica para salvar as alterações
  };

  return (
    <div className="configuracoes-page">
      <div className="page-header">
        <h1>Configurações</h1>
        <p>Personalize sua experiência no <span className="brand-name">Meu Bolso</span></p>
      </div>

      <div className="configuracoes-content">
        {/* Perfil do Usuário */}
        <div className="config-card">
          <div className="card-header">
            <img src={simboloMeuBolsoUsadoNoCardDePerfilDoUsuario} alt="Perfil" className="card-icon" />
            <h3>Perfil do Usuário</h3>
          </div>
          
          <div className="profile-form">
            <div className="form-group">
              <label>Nome Completo</label>
              <input
                type="text"
                value={userProfile.nomeCompleto}
                onChange={(e) => handleProfileChange('nomeCompleto', e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={userProfile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Entrada Mensal</label>
              <input
                type="text"
                value={userProfile.entradaMensal}
                onChange={(e) => handleProfileChange('entradaMensal', e.target.value)}
                className="form-input"
              />
            </div>
            
            <button className="save-button" onClick={handleSaveChanges}>
              Salvar Alterações
            </button>
          </div>
        </div>

        {/* Notificações */}
        <div className="config-card">
          <div className="card-header">
            <img src={simboloMeuBolsoUtilizadoNoCardDeNotificacoes} alt="Notificações" className="card-icon" />
            <h3>Notificações</h3>
          </div>
          
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-info">
                  <span className="notification-label">{notification.label}</span>
                  <span className="notification-description">{notification.description}</span>
                </div>
                <div 
                  className={`toggle-switch ${notification.enabled ? 'enabled' : 'disabled'}`}
                  onClick={() => handleNotificationToggle(notification.id)}
                >
                  <div className="toggle-circle"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bancos Conectados */}
        <div className="config-card bancos-card">
          <div className="card-header">
            <img src={SimboloMeuBolsoUtilizadoNoCardDeBancosConectados} alt="Bancos" className="card-icon" />
            <h3>Bancos conectados</h3>
          </div>
          
          <div className="bancos-grid">
            {bancos.map((banco) => (
              <div key={banco.id} className="banco-item" style={{ borderColor: banco.color }}>
                <div className="banco-logo" style={{ backgroundColor: banco.color }}>
                  {banco.logo}
                </div>
              </div>
            ))}
            <div className="banco-item add-banco">
              <div className="banco-logo add-logo">
                <span>+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;