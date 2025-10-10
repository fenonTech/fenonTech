import React from "react";
import "./Header.css";

interface HeaderProps {
  userName: string;
  userAvatar?: string;
  pageTitle?: string;
  pageDescription?: string;
}

const Header: React.FC<HeaderProps> = ({
  userName,
  userAvatar,
  pageTitle = "DashBoard Financeiro",
  pageDescription = "Bem-vindo ao seu controle financeiro inteligente",
}) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>{pageTitle}</h1>
          <p>{pageDescription}</p>
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
