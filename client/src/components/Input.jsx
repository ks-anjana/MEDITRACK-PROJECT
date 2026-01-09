import React from 'react';

// Reusable Input Component
const Input = ({ 
  label, 
  type = 'text', 
  name,
  placeholder, 
  value, 
  onChange, 
  error,
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="mb-4">
      {/* Label */}
      {label && (
        <label 
          htmlFor={name}
          className="block text-gray-200 font-medium mb-2"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Field */}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-3
          border rounded-lg
          bg-slate-900
          text-white
          placeholder-gray-500
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
          disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-600'}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      />
      
      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-sm mt-1 flex items-center">
          <svg 
            className="w-4 h-4 mr-1 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
