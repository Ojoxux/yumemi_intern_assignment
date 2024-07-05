import React from 'react';
import Title from '../atoms/Title';

const Header: React.FC = () => (
  <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 shadow-lg">
    <div className="container mx-auto flex items-center justify-between">
      <Title>都道府県別人口推移</Title>
      <div className="text-white text-sm">
        データ提供: RESAS（地域経済分析システム）
      </div>
    </div>
  </header>
);

export default Header;