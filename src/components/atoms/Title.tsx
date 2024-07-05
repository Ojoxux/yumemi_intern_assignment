// src/components/atoms/Title.tsx
import React from 'react';

interface TitleProps {
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ children }) => (
  <h1 className="text-2xl font-bold">{children}</h1>
);

export default Title;
