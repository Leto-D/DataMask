import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: {
      switch: 'h-5 w-9',
      thumb: 'h-4 w-4',
      translate: 'translate-x-4'
    },
    md: {
      switch: 'h-6 w-11',
      thumb: 'h-5 w-5',
      translate: 'translate-x-5'
    }
  };

  const { switch: switchClass, thumb: thumbClass, translate: translateClass } = sizeClasses[size];

  return (
    <div className="flex items-start">
      <button
        type="button"
        className={`
          ${switchClass} relative inline-flex flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${checked ? 'bg-primary-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
      >
        <motion.span
          className={`
            ${thumbClass} pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
          `}
          animate={{
            x: checked ? translateClass.replace('translate-x-', '') : 0
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
      
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label className="text-sm font-medium text-gray-900">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};