import React, { useState } from 'react';
import './Layout.css';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';

const Layout: React.FC = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    
    // Simular ações dos menu items
    switch (item) {
      case 'sair':
        if (window.confirm('Deseja realmente sair?')) {
          console.log('Usuário saiu');
        }
        break;
      case 'configuracao':
        console.log('Abrir configurações');
        break;
      default:
        console.log(`Navegar para: ${item}`);
    }
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <Dashboard />;
      case 'receitas':
        return (
          <div className="page-placeholder">
            <h2>Receitas</h2>
            <p>Página em desenvolvimento...</p>
          </div>
        );
      case 'despesas':
        return (
          <div className="page-placeholder">
            <h2>Despesas</h2>
            <p>Página em desenvolvimento...</p>
          </div>
        );
      case 'contas':
        return (
          <div className="page-placeholder">
            <h2>Contas a Pagar</h2>
            <p>Página em desenvolvimento...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="layout">
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <div className="main-content">
        <Header userName="Gustavo Nascimento" />
        <main className="content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Layout;