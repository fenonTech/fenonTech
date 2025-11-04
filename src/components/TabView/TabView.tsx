import React from "react";
import "./TabView.css";

interface Tab {
  id: string;
  label: string;
}

interface TabViewProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

const TabView: React.FC<TabViewProps> = ({
  tabs,
  activeTab,
  onTabChange,
  children,
}) => {
  return (
    <div className="tab-view">
      <div className="tab-view-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && <div className="tab-indicator" />}
          </button>
        ))}
      </div>
      <div className="tab-view-content">{children}</div>
    </div>
  );
};

export default TabView;
