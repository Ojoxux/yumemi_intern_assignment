// src/components/molecules/Header.test.tsx
import { render, screen } from '@testing-library/react';
import Header from './Header';

// CSSのインポートをモック化
jest.mock('../../styles/Header.css', () => ({}));

describe('Header', () => {
  it('renders the header with title', () => {
    render(<Header />);
    expect(screen.getByText('都道府県別人口推移')).toBeInTheDocument();
  });

  it('renders the data source information', () => {
    render(<Header />);
    expect(screen.getByText(/データ提供: RESAS/)).toBeInTheDocument();
  });
});
