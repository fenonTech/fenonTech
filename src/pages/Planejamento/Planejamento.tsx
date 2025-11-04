import React, { useState } from "react";
import "./Planejamento.css";
import TabView from "../../components/TabView";
import GeralTab from "../../components/GeralTab";
import MensalTab from "../../components/MensalTab";
import MobileTabView from "../../components/MobileTabView";
import type { MobileTab } from "../../components/MobileTabView";

const Planejamento: React.FC = () => {
  const [activeTab, setActiveTab] = useState("geral");

  const tabs = [
    { id: "geral", label: "Geral" },
    { id: "mensal", label: "Por Mês" },
  ];

  // Tabs Mobile - Sistema otimizado para mobile
  const mobileTabs: MobileTab[] = [
    {
      id: "geral",
      label: "Anual",
      icon: <span>📅</span>,
      content: (
        <div className="planejamento-mobile-geral">
          <GeralTab />
        </div>
      ),
    },
    {
      id: "mensal",
      label: "Mensal",
      icon: <span>📊</span>,
      content: (
        <div className="planejamento-mobile-mensal">
          <MensalTab />
        </div>
      ),
    },
  ];

  return (
    <div className="planejamento">
      {/* Desktop - Sistema original de tabs */}
      <div className="planejamento-desktop">
        <TabView tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
          {activeTab === "geral" && <GeralTab />}
          {activeTab === "mensal" && <MensalTab />}
        </TabView>
      </div>

      {/* Mobile - Novo sistema de tabs */}
      <div className="planejamento-mobile">
        <MobileTabView tabs={mobileTabs} defaultTab="geral" />
      </div>
    </div>
  );
};

export default Planejamento;
