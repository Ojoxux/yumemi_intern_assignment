import React from 'react';
import styles from './Title.module.css';

interface TitleProps {
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ children }) => (
  <h1 className={styles['title']}>{children}</h1>
);

export default Title;