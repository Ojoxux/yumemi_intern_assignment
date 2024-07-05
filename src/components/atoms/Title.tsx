// src/components/atoms/Title.tsx
import React from 'react';

interface TitleProps {
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ children }) => (
  <h1 className="text-3xl font-bold text-white tracking-wide">{children}</h1>
);

export default Title;