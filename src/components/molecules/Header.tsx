import React from 'react';
import Title from '../atoms/Title';
import '../../styles/Header.css';

const Header: React.FC = () => (
  <header className="header">
    <div className="header-container">
      <Title>都道府県別人口推移</Title>
      <div className="header-subtitle">
        データ提供: RESAS（地域経済分析システム）
      </div>
    </div>
  </header>
);

export default Header;