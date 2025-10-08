import React, { useState } from 'react';
import './Sidebar.css';
import logo from '../../assets/logo.png';
import simboloDashboard from '../../assets/simboloDashboardAmarelo.png';
import simboloReceita from '../../assets/simboloMenuReceita.png';
import simboloDespesas from '../../assets/simboloMenuDespesas.png';
import simboloConfiguracao from '../../assets/simboloConfiguracao.png';
import simboloSaida from '../../assets/simboloSaida.png';
import simboloMenuBurguer from '../../assets/simboloMenuBurguer.png';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'DashBoard', icon: simboloDashboard },
    { id: 'receitas', label: 'Receitas', icon: simboloReceita },
    { id: 'despesas', label: 'Despesas', icon: simboloDespesas },
  ];

  const systemItems = [
    { id: 'configuracao', label: 'Configuração', icon: simboloConfiguracao },
    { id: 'sair', label: 'Sair', icon: simboloSaida },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img src={logo} alt="Meu Bolso" className="logo" />
        {!isCollapsed && <span className="app-name">Meu Bolso</span>}
        <button 
          className="menu-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <img src={simboloMenuBurguer} alt="Menu" />
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          {!isCollapsed && <span className="nav-title">Navegação</span>}
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                  onClick={() => onItemClick(item.id)}
                >
                  <img src={item.icon} alt={item.label} className="nav-icon" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-section">
          {!isCollapsed && <span className="nav-title">Sistema</span>}
          <ul className="nav-list">
            {systemItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                  onClick={() => onItemClick(item.id)}
                >
                  <img src={item.icon} alt={item.label} className="nav-icon" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;