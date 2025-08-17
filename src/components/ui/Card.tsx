import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const baseClasses = `
    bg-white rounded-lg border border-gray-200 shadow-sm
    ${paddingClasses[padding]}
    ${className}
  `;

  const CardComponent = hover ? motion.div : 'div';
  
  const hoverProps = hover ? {
    whileHover: { y: -2, shadow: '0 4px 12px rgba(0, 0, 0, 0.1)' },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      className={baseClasses}
      {...hoverProps}
    >
      {children}
    </CardComponent>
  );
};