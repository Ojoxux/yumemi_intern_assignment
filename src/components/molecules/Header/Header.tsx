import React from 'react';
import Title from '../../atoms/Title/Title';
import styles from './Header.module.css';
import tstyles from '../../atoms/Title/Title.module.css';

const Header: React.FC = () => (
  <header className={styles['header']}>
    <div className={styles['header-container']}>
      <Title className={tstyles['title']}>都道府県別人口推移</Title>
      <div className={styles['header-subtitle']}>
        データ提供: RESAS（地域経済分析システム）
      </div>
    </div>
  </header>
);

export default Header;