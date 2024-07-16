import React from 'react';
import styles from './Title.module.css';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

const Title: React.FC<TitleProps> = ({ children, className }) => (
  <h1 className={`${styles['title']} ${className || ''}`}>{children}</h1>
);

export default Title;