import React from 'react';
import Header from '../molecules/Header/Header';
import styles from './BasicTemplate.module.css'

interface BasicTemplateProps {
  children: React.ReactNode;
}

const BasicTemplate: React.FC<BasicTemplateProps> = ({ children }) => (
  <div className={styles['main-container']}>
    <Header />
    <main className={styles['content']}>{children}</main>
  </div>
);

export default BasicTemplate;