import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  Icon?: React.ElementType;
  // Fix: Add optional size prop to support different button sizes.
  size?: 'sm' | 'md';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', Icon, ...props }) => {
  // Fix: Remove sizing styles from base classes to be handled by the new size prop.
  const baseClasses = 'inline-flex items-center justify-center border border-transparent font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-muted text-neutral-dark hover:bg-neutral focus:ring-primary',
    danger: 'bg-danger text-white hover:bg-red-600 focus:ring-danger',
  };

  // Fix: Define classes for different button sizes.
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
  };

  return (
    <button
      // Fix: Apply the appropriate size class based on the size prop.
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="mr-2 -ml-1 h-5 w-5" />}
      {children}
    </button>
  );
};

export default Button;