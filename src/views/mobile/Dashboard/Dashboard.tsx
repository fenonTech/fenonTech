import React, { useState } from "react";
import HeaderMobile from "../../../components/HeaderMobile";
import FinancialCardMobile from "../../../components/FinancialCardMobile";
import { UltimasTransacoesMobile } from "../../../components/UltimasTransacoesMobile";
import { BottomNavigationMobile } from "../../../components/BottomNavigationMobile";
import type { MobileScreenType } from "../../../components/LayoutMobile";
import "./Dashboard.css";

interface DashboardProps {
  onNavigate?: (screen: MobileScreenType) => void;
  isBalanceVisible?: boolean;
  onToggleVisibility: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  isBalanceVisible = true,
  onToggleVisibility,
}) => {
  const [activeNavTab, setActiveNavTab] = useState<
    "inicio" | "receitas" | "despesas"
  >("inicio");

  const handleConfigClick = () => {
    if (onNavigate) {
      onNavigate("configuracoes");
    }
  };

  const handleLogoutClick = () => {
    console.log("Fazer logout");
    // TODO: Implementar logout
  };

  const handleNavTabChange = (tab: "inicio" | "receitas" | "despesas") => {
    setActiveNavTab(tab);
    console.log(`Navegar para: ${tab}`);
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  // Dados de exemplo para as últimas transações
  const ultimasTransacoes = [
    {
      id: "1",
      tipo: "saida" as const,
      categoria: "Alimentação",
      valor: 50.0,
      data: "2025-10-31",
    },
    {
      id: "2",
      tipo: "entrada" as const,
      categoria: "Alimentação",
      valor: 50.0,
      data: "2025-10-31",
    },
    {
      id: "3",
      tipo: "saida" as const,
      categoria: "Alimentação",
      valor: 50.0,
      data: "2025-10-31",
    },
    {
      id: "4",
      tipo: "saida" as const,
      categoria: "Alimentação",
      valor: 50.0,
      data: "2025-10-31",
    },
    {
      id: "5",
      tipo: "entrada" as const,
      categoria: "Freelance",
      valor: 150.0,
      data: "2025-10-30",
    },
    {
      id: "6",
      tipo: "saida" as const,
      categoria: "Transporte",
      valor: 25.0,
      data: "2025-10-29",
    },
    {
      id: "7",
      tipo: "entrada" as const,
      categoria: "Vendas",
      valor: 300.0,
      data: "2025-10-28",
    },
    {
      id: "8",
      tipo: "saida" as const,
      categoria: "Lazer",
      valor: 80.0,
      data: "2025-10-27",
    },
    {
      id: "9",
      tipo: "entrada" as const,
      categoria: "Investimentos",
      valor: 200.0,
      data: "2025-10-26",
    },
  ];

  return (
    <div className="mobile-screen-container">
      <HeaderMobile
        userName="Gustavo Lindão"
        onConfigClick={handleConfigClick}
        onLogoutClick={handleLogoutClick}
      />
      <div className="mobile-screen-content">
        <FinancialCardMobile
          receitas={2150.37}
          despesas={1950.37}
          contasPagar={1950.37}
          contasReceber={2150.37}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={onToggleVisibility}
          mesAno="OUT/2025"
          mode="dashboard"
          onNavigate={handleNavTabChange}
        />
        <UltimasTransacoesMobile
          transacoes={ultimasTransacoes}
          isBalanceVisible={isBalanceVisible}
        />
      </div>

      <BottomNavigationMobile
        activeTab={activeNavTab}
        onTabChange={handleNavTabChange}
      />
    </div>
  );
};

export default Dashboard;
