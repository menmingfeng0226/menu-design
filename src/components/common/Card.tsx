import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  selected = false,
  onClick,
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-md overflow-hidden';
  
  const hoverStyles = hover ? 'transition-all duration-200 hover:shadow-xl hover:scale-[1.02] cursor-pointer' : '';
  
  const selectedStyles = selected ? 'ring-2 ring-amber-500' : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${selectedStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
