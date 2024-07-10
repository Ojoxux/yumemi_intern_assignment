import React from 'react';
import '../../molecules/Header/Header.module.css';

interface TitleProps {
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ children }) => (
  <h1 className="header-title">{children}</h1>
);

export default Title;