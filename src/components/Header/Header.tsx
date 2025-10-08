import React from 'react';
import './Header.css';

interface HeaderProps {
  userName: string;
  userAvatar?: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userAvatar }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>DashBoard Financeiro</h1>
          <p>Bem-vindo ao seu controle financeiro inteligente</p>
        </div>
        
        <div className="user-info">
          <div className="user-avatar">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} />
            ) : (
              <div className="avatar-placeholder">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="user-name">{userName}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;