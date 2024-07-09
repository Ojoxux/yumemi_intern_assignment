import { render, fireEvent, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders button with children', () => {
    const { getByText } = render(<Button onClick={() => {}}>Test Button</Button>);
    expect(getByText('Test Button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    const { getByText } = render(<Button onClick={mockOnClick}>Test Button</Button>);
    fireEvent.click(getByText('Test Button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Button onClick={() => {}} className="custom-class">Custom Button</Button>);
    expect(screen.getByText('Custom Button')).toHaveClass('custom-class');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button onClick={() => {}} disabled>Disabled Button</Button>);
    expect(screen.getByText('Disabled Button')).toBeDisabled();
  });
});