import React from 'react';
import Header from '../molecules/Header/Header';

interface BasicTemplateProps {
  children: React.ReactNode;
}

const BasicTemplate: React.FC<BasicTemplateProps> = ({ children }) => (
  <div className="main-container">
    <Header />
    <main className="content">{children}</main>
  </div>
);

export default BasicTemplate;