import React from 'react';

// Reusable Card Component
const Card = ({ 
  title, 
  children, 
  className = '',
  hover = false,
  padding = 'default',
  onClick
}) => {
  // Padding variants
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  // Hover effect classes
  const hoverClasses = hover 
    ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all duration-300' 
    : 'transition-shadow duration-200';

  // Click handler classes
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`
        bg-white 
        rounded-xl 
        shadow-md
        ${paddingClasses[padding]}
        ${hoverClasses}
        ${clickableClasses}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyPress={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
    >
      {title && (
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Card;
