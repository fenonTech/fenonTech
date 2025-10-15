import React, { useState, useRef, useEffect } from "react";
import "./Header.css";
import logoNavbar from "../../assets/logo.png";

interface HeaderProps {
  userName: string;
  userAvatar?: string;
  pageTitle?: string;
  pageDescription?: string;
  onConfigClick?: () => void;
  onLogoutClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userName,
  userAvatar,
  pageTitle = "DashBoard Financeiro",
  pageDescription = "Bem-vindo ao seu controle financeiro inteligente",
  onConfigClick,
  onLogoutClick,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleConfigClick = () => {
    setIsDropdownOpen(false);
    onConfigClick?.();
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    onLogoutClick?.();
  };
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <img src={logoNavbar} alt="FenonTech Logo" className="logo-navbar" />
        </div>
        <div className="header-title">
          <h1>{pageTitle}</h1>
          <p>{pageDescription}</p>
        </div>
        <div className="user-info" ref={dropdownRef}>
          <div
            className={`user-profile ${isDropdownOpen ? "active" : ""}`}
            onClick={handleUserClick}
          >
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
            <svg
              className={`dropdown-arrow ${isDropdownOpen ? "rotated" : ""}`}
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Dropdown Menu - Apenas Mobile */}
          {isDropdownOpen && (
            <div className="user-dropdown mobile-only">
              <button className="dropdown-item" onClick={handleConfigClick}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.08a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                Configurações
              </button>
              <button
                className="dropdown-item logout"
                onClick={handleLogoutClick}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
