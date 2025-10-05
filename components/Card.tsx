import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  // Fix: Add optional onClick handler to allow cards to be clickable.
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ${className}`}
      // Fix: Pass onClick to the div element.
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
