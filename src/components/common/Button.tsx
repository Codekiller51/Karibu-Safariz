import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const getVariantClasses = (variant: string) => {
  switch (variant) {
    case 'primary':
      return 'bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800 shadow-md hover:shadow-lg';
    case 'secondary':
      return 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400';
    case 'outline':
      return 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50 active:bg-orange-100';
    case 'ghost':
      return 'text-orange-600 hover:bg-orange-50 active:bg-orange-100';
    default:
      return 'bg-orange-600 text-white hover:bg-orange-700';
  }
};

const getSizeClasses = (size: string) => {
  switch (size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm';
    case 'lg':
      return 'px-8 py-4 text-lg';
    default:
      return 'px-6 py-2.5 text-base';
  }
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    icon,
    fullWidth = false,
    className = '',
    children,
    ...props
  }, ref) => {
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);

    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2 font-medium rounded-lg
          transition-all duration-300 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600
          ${variantClasses}
          ${sizeClasses}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({
    to,
    variant = 'primary',
    size = 'md',
    icon,
    fullWidth = false,
    className = '',
    children,
    ...props
  }, ref) => {
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);

    return (
      <Link
        ref={ref}
        to={to}
        className={`
          inline-flex items-center justify-center gap-2 font-medium rounded-lg
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600
          ${variantClasses}
          ${sizeClasses}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {icon}
        {children}
      </Link>
    );
  }
);

LinkButton.displayName = 'LinkButton';

export { Button, LinkButton };
export type { ButtonProps, LinkButtonProps };
