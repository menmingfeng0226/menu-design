import React, { useState, useEffect } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  defaultActive?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, activeTab: externalActiveTab, onChange }) => {
  const defaultActiveTab = tabs.find(tab => tab.defaultActive)?.id;
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || defaultActiveTab || tabs[0]?.id);
  
  const isControlled = externalActiveTab !== undefined;
  const currentActiveTab = isControlled ? externalActiveTab : internalActiveTab;

  useEffect(() => {
    if (isControlled && externalActiveTab !== internalActiveTab) {
      setInternalActiveTab(externalActiveTab);
    }
  }, [externalActiveTab, isControlled, internalActiveTab]);

  const handleTabClick = (tabId: string) => {
    if (!isControlled) {
      setInternalActiveTab(tabId);
    }
    if (onChange) {
      onChange(tabId);
    }
  };

  const activeContent = tabs.find(tab => tab.id === currentActiveTab)?.content;

  return (
    <div>
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              px-6 py-3 text-sm font-medium transition-colors relative
              ${currentActiveTab === tab.id
                ? 'text-amber-600'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {tab.label}
            {currentActiveTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />
            )}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {activeContent}
      </div>
    </div>
  );
};
