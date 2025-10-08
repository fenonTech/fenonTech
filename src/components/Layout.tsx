import React, { useState } from 'react';
import './Layout.css';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../pages/Dashboard';
import Receitas from '../pages/Receitas';
import Despesas from '../pages/Despesas';

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
        return <Receitas />;
      case 'despesas':
        return <Despesas />;
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