import React from 'react';

// Reusable Input Component
const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error,
  required = false,
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 font-medium mb-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input-field ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...props}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Input;
