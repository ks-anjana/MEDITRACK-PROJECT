import React from 'react';

// Alert Component for displaying messages
const Alert = ({ 
  type = 'info', 
  message, 
  onClose,
  autoClose = true,
  duration = 5000 
}) => {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const typeClasses = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  return (
    <div className={`border-l-4 p-4 ${typeClasses[type]} mb-4`} role="alert">
      <p className="font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default Alert;
