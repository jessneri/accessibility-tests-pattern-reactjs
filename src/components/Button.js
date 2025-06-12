import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  disabled = false, 
  onClick,
  type = 'button',
  ariaLabel,
  ariaDescribedBy,
  ...props 
}) => {
  const handleClick = (event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    if (onClick) {
      onClick(event);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event);
    }
  };

  return (
    <button
      type={type}
      className={`button button--${variant}`}
      disabled={disabled}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 