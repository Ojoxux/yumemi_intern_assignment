// src/components/atoms/Title.test.tsx
import { render, screen } from '@testing-library/react';
import Title from './Title';

describe('Title', () => {
  it('renders the title text', () => {
    render(<Title>Test Title</Title>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
