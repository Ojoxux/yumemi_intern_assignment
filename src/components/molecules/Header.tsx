// src/components/molecules/Header.tsx
import React from 'react';
import Title from '../atoms/Title';

const Header: React.FC = () => (
  <header className="bg-blue-500 p-4">
    <Title>都道府県別人口推移</Title>
  </header>
);

export default Header;