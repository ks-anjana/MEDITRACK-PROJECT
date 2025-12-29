import React from 'react';

// Reusable Card Component
const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {title && <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
