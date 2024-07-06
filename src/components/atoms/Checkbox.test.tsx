import { render, fireEvent } from '@testing-library/react';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('renders correctly', () => {
    const { getByRole } = render(<Checkbox id="test" checked={false} onChange={() => {}} />);
    expect(getByRole('checkbox')).toBeInTheDocument();
  });

  it('calls onChange when clicked', () => {
    const mockOnChange = jest.fn();
    const { getByRole } = render(<Checkbox id="test" checked={false} onChange={mockOnChange} />);
    fireEvent.click(getByRole('checkbox'));
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });
});