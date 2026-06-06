import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'bottom' }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        position === 'bottom' ? (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            {content}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
          </div>
        ) : (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
          </div>
        )
      )}
    </div>
  );
};
