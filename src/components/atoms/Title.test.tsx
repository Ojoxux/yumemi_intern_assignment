import { render, screen } from '@testing-library/react';
import Title from './Title';

// CSSのインポートをモック化
jest.mock('../../styles/Header.css', () => ({}));

describe('Title', () => {
  it('renders the title text', () => {
    render(<Title>Test Title</Title>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
