import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PopulationCategorySelector from './PopulationCategorySelector';

// SelectBoxコンポーネントのモック
jest.mock('../../atoms/SelectBox/SelectBox', () => {
  return function MockSelectBox({ options, value, onChange, id }: any) {
    return (
      <select data-testid="mock-select-box" value={value} onChange={(e) => onChange(e.target.value)} id={id}>
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };
});

describe('PopulationCategorySelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with correct label', () => {
    render(<PopulationCategorySelector value="総人口" onChange={mockOnChange} />);
    expect(screen.getByText('人口カテゴリ：')).toBeInTheDocument();
  });

  it('renders SelectBox with correct props', () => {
    render(<PopulationCategorySelector value="総人口" onChange={mockOnChange} />);
    const selectBox = screen.getByTestId('mock-select-box');
    expect(selectBox).toBeInTheDocument();
    expect(selectBox).toHaveAttribute('id', 'population-category');
  });

  it('renders all category options', () => {
    render(<PopulationCategorySelector value="総人口" onChange={mockOnChange} />);
    expect(screen.getByText('総人口')).toBeInTheDocument();
    expect(screen.getByText('年少人口')).toBeInTheDocument();
    expect(screen.getByText('生産年齢人口')).toBeInTheDocument();
    expect(screen.getByText('老年人口')).toBeInTheDocument();
  });

  it('calls onChange with correct value when selection changes', () => {
    render(<PopulationCategorySelector value="総人口" onChange={mockOnChange} />);
    const selectBox = screen.getByTestId('mock-select-box');
    fireEvent.change(selectBox, { target: { value: '年少人口' } });
    expect(mockOnChange).toHaveBeenCalledWith('年少人口');
  });

  it('applies correct CSS classes', () => {
    render(<PopulationCategorySelector value="総人口" onChange={mockOnChange} />);
    expect(screen.getByTestId('mock-select-box').parentElement).toHaveClass('container');
    expect(screen.getByText('人口カテゴリ：')).toHaveClass('label');
  });

  it('sets the correct initial value', () => {
    render(<PopulationCategorySelector value="生産年齢人口" onChange={mockOnChange} />);
    expect(screen.getByTestId('mock-select-box')).toHaveValue('生産年齢人口');
  });
});