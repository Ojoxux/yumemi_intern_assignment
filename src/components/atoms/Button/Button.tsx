import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className, disabled }) => (
    <button 
      onClick={onClick} 
      className={`${styles.button} ${className}`} 
      disabled={disabled}
    >
      {children}
    </button>
  );

export default Button;