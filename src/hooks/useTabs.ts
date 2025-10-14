import { useState } from "react";

export const useTabs = (initialTab: string = "principal") => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const switchTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  return {
    activeTab,
    switchTab,
  };
};

export default useTabs;
