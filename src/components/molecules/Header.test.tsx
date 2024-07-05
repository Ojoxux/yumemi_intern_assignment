// src/components/molecules/Header.test.tsx
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the header with title', () => {
    render(<Header />);
    expect(screen.getByText('都道府県別人口推移')).toBeInTheDocument();
  });
});
