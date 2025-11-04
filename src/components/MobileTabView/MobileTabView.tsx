import React, { useState, useRef, useEffect } from "react";
import "./MobileTabView.css";

export interface MobileTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  content: React.ReactNode;
}

interface MobileTabViewProps {
  tabs: MobileTab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

const MobileTabView: React.FC<MobileTabViewProps> = ({
  tabs,
  defaultTab,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    updateIndicator(activeTab);
  }, [activeTab]);

  const updateIndicator = (tabId: string) => {
    const tabElement = tabRefs.current[tabId];
    if (tabElement) {
      setIndicatorStyle({
        left: tabElement.offsetLeft,
        width: tabElement.offsetWidth,
      });
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="mobile-tab-view">
      <div className="mobile-tab-header">
        <div className="mobile-tab-buttons">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
                return;
              }}
              className={`mobile-tab-button ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.icon && <span className="tab-icon">{tab.icon}</span>}
              <span className="tab-label">{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="tab-badge">{tab.badge}</span>
              )}
            </button>
          ))}
          <div
            className="tab-indicator"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />
        </div>
      </div>
      <div className="mobile-tab-content">{activeTabContent}</div>
    </div>
  );
};

export default MobileTabView;
