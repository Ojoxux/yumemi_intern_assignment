import { render, screen } from '@testing-library/react';
import Label from './Label';

describe('Label', () => {
    it('renders label text correctly', () => {
      render(<Label htmlFor="test-id">Test Label</Label>);
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });
  
    it('applies the correct htmlFor attribute', () => {
      render(<Label htmlFor="test-id">Test Label</Label>);
      expect(screen.getByText('Test Label')).toHaveAttribute('for', 'test-id');
    });
  
    it('applies additional className when provided', () => {
      render(<Label htmlFor="test-id" className="custom-class">Test Label</Label>);
      expect(screen.getByText('Test Label')).toHaveClass('custom-class');
    });
  
    it('does not apply className when not provided', () => {
      render(<Label htmlFor="test-id">Test Label</Label>);
      expect(screen.getByText('Test Label')).not.toHaveAttribute('class');
    });
  });