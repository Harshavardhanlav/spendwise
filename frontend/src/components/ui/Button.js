import React from 'react';

function Button({ children, variant = 'primary', size = 'medium', icon, className = '', ...props }) {
  return (
    <button type="button" className={`button button-${variant} button-${size} ${className}`} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  );
}

export default Button;
