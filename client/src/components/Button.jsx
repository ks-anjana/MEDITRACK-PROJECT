import React from 'react';

// Reusable Button Component
const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClass = 'px-4 py-2 rounded font-medium transition duration-200 ease-in-out';
  
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300',
    secondary: 'bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
