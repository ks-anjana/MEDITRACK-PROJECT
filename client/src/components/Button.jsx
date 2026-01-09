import React from 'react';

// Reusable Button Component
const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClass = 'font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed inline-flex items-center justify-center';
  
  // Size variants
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-xl',
  };

  // Color variants matching MediTrack theme
  const variants = {
    primary: `
      bg-gradient-to-r from-cyan-500 to-sky-500 
      text-slate-900 
      hover:from-cyan-600 hover:to-sky-600 
      focus:ring-cyan-500
      shadow-md hover:shadow-lg
      disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none disabled:text-gray-400
    `,
    secondary: `
      bg-gradient-to-r from-blue-500 to-indigo-500 
      text-white 
      hover:from-blue-600 hover:to-indigo-600 
      focus:ring-blue-500
      shadow-md hover:shadow-lg
      disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none disabled:text-gray-400
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 
      text-white 
      hover:from-red-600 hover:to-red-700 
      focus:ring-red-500
      shadow-md hover:shadow-lg
      disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none disabled:text-gray-400
    `,
    outline: `
      border-2 border-cyan-500 
      text-cyan-400 
      bg-transparent
      hover:bg-cyan-900/30 hover:border-cyan-400
      focus:ring-cyan-500
      disabled:border-gray-600 disabled:text-gray-600 disabled:hover:bg-transparent
    `,
    ghost: `
      text-cyan-400 
      bg-transparent
      hover:bg-cyan-900/30
      focus:ring-cyan-500
      disabled:text-gray-600 disabled:hover:bg-transparent
    `,
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${baseClass} 
        ${sizes[size]} 
        ${variants[variant]} 
        ${widthClass} 
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-5 w-5" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {/* Button Content */}
      {children}
    </button>
  );
};

export default Button;
