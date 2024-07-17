import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectBox from './SelectBox';

describe('SelectBox', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const mockOnChange = jest.fn();

  it('renders with all options', () => {
    render(<SelectBox options={mockOptions} value="option1" onChange={mockOnChange} />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    mockOptions.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('selects the correct default value', () => {
    render(<SelectBox options={mockOptions} value="option2" onChange={mockOnChange} />);

    const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
    expect(selectElement.value).toBe('option2');
  });

  it('calls onChange when a new option is selected', () => {
    render(<SelectBox options={mockOptions} value="option1" onChange={mockOnChange} />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'option3' } });

    expect(mockOnChange).toHaveBeenCalledWith('option3');
  });

  it('renders with custom id when provided', () => {
    const customId = 'custom-select-id';
    render(<SelectBox options={mockOptions} value="option1" onChange={mockOnChange} id={customId} />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveAttribute('id', customId);
  });

  it('applies correct CSS classes', () => {
    render(<SelectBox options={mockOptions} value="option1" onChange={mockOnChange} />);

    const wrapperElement = screen.getByRole('combobox').parentElement;
    expect(wrapperElement).toHaveClass('selectWrapper');

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveClass('selectBox');
  });
});