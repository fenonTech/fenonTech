import React, { useState } from "react";
import HeaderMobile from "../../../components/HeaderMobile";
import FinancialCardMobile from "../../../components/FinancialCardMobile";
import { UltimasTransacoesMobile } from "../../../components/UltimasTransacoesMobile";
import { BottomNavigationMobile } from "../../../components/BottomNavigationMobile";
import type { MobileScreenType } from "../../../components/LayoutMobile";
import { useFilter } from "../../../contexts/FilterContext";
import { useDashboardData } from "../../../hooks/queries";
import { formatTableDate } from "../../../utils";
import "./Dashboard.css";

interface DashboardProps {
  onNavigate?: (screen: MobileScreenType) => void;
  isBalanceVisible?: boolean;
  onToggleVisibility: () => void;
  userName?: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  isBalanceVisible = true,
  onToggleVisibility,
  userName = "Usuário",
}) => {
  const { selectedMonth, selectedYear } = useFilter();
  const [activeNavTab, setActiveNavTab] = useState<
    "inicio" | "receitas" | "despesas"
  >("inicio");

  // React Query - Busca dados do dashboard com cache automático
  const {
    data: dashboardData,
  } = useDashboardData(
    selectedMonth + 1,
    selectedYear
  );

  // Extrair dados (com valores padrão)
  const saldo = dashboardData?.saldo ?? 0;
  const contasAReceber = dashboardData?.contasAReceber ?? 0;
  const contasAPagar = dashboardData?.contasAPagar ?? 0;
  const transacoes = dashboardData?.transacoes ?? [];

  // Formatar transações para o componente UltimasTransacoesMobile
  const ultimasTransacoes = transacoes.slice(0, 9).map((t) => ({
    id: t.codigo.toString(),
    tipo: t.is_entrada ? ("entrada" as const) : ("saida" as const),
    categoria: t.tipo || t.descricao || "Sem categoria",
    valor: t.valor,
    data: t.data_pagamento ? formatTableDate(t.data_pagamento) : "--/--",
    dataOriginal: t.data_pagamento, // Data original para filtro
  }));

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

  return (
    <div className="mobile-screen-container">
      <HeaderMobile
        userName={userName}
        onConfigClick={handleConfigClick}
        onLogoutClick={handleLogoutClick}
      />
      <div className="mobile-screen-content">
        <FinancialCardMobile
          receitas={0} // Não usado quando saldo é fornecido
          despesas={0} // Não usado quando saldo é fornecido
          contasPagar={contasAPagar}
          contasReceber={contasAReceber}
          saldo={saldo}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={onToggleVisibility}
          mesAno={`${String(selectedMonth + 1).padStart(
            2,
            "0"
          )}/${selectedYear}`}
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
