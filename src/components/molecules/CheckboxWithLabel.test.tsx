import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CheckboxWithLabel from './CheckboxWithLabel';

describe('CheckboxWithLabel', () => {
  it('renders correctly', () => {
    const { getByLabelText } = render(
      <CheckboxWithLabel label="Test Label" checked={false} onChange={() => {}} />
    );
    expect(getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('calls onChange when clicked', () => {
    const mockOnChange = jest.fn();
    const { getByLabelText } = render(
      <CheckboxWithLabel label="Test Label" checked={false} onChange={mockOnChange} />
    );
    fireEvent.click(getByLabelText('Test Label'));
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });
});