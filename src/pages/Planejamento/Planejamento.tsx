import React, { useState } from "react";
import "./Planejamento.css";
import TabView from "../../components/TabView";
import GeralTab from "../../components/GeralTab";
import MensalTab from "../../components/MensalTab";

const Planejamento: React.FC = () => {
  const [activeTab, setActiveTab] = useState("geral");

  const tabs = [
    { id: "geral", label: "Geral" },
    { id: "mensal", label: "Por Mês" },
  ];

  return (
    <div className="planejamento">
      <TabView tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "geral" && <GeralTab />}
        {activeTab === "mensal" && <MensalTab />}
      </TabView>
    </div>
  );
};

export default Planejamento;
