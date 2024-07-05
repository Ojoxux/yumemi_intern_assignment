import { render, fireEvent, screen } from '@testing-library/react';
import CheckboxWithLabel from './CheckboxWithLabel';

describe('CheckboxWithLabel', () => {
  it('renders the label', () => {
    render(<CheckboxWithLabel label="Test Label" checked={false} onChange={() => {}} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('calls onChange when checkbox is clicked', () => {
    const mockOnChange = jest.fn();
    render(<CheckboxWithLabel label="Test Label" checked={false} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('renders checkbox as checked when checked prop is true', () => {
    render(<CheckboxWithLabel label="Test Label" checked={true} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});