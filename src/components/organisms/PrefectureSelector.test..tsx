import { render, fireEvent, screen } from '@testing-library/react';
import PrefectureSelector from './PrefectureSelector';
import { Prefecture } from '../../types';

const mockPrefectures: Prefecture[] = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
];

describe('PrefectureSelector', () => {
  it('renders all prefectures', () => {
    const mockOnChange = jest.fn();
    render(
      <PrefectureSelector
        prefectures={mockPrefectures}
        selectedPrefectures={{}}
        onPrefectureChange={mockOnChange}
      />
    );
    expect(screen.getByText('北海道')).toBeInTheDocument();
    expect(screen.getByText('青森県')).toBeInTheDocument();
  });

  it('calls onPrefectureChange when a prefecture is selected', () => {
    const mockOnChange = jest.fn();
    render(
      <PrefectureSelector
        prefectures={mockPrefectures}
        selectedPrefectures={{}}
        onPrefectureChange={mockOnChange}
      />
    );
    fireEvent.click(screen.getByLabelText('北海道'));
    expect(mockOnChange).toHaveBeenCalledWith(1, true);
  });

  it('calls onClearAll when the clear all button is clicked', () => {
    const mockOnChange = jest.fn();
    const mockOnClearAll = jest.fn();
    render(
      <PrefectureSelector
        prefectures={mockPrefectures}
        selectedPrefectures={{}}
        onPrefectureChange={mockOnChange}
      />
    );
    fireEvent.click(screen.getByText('全て外す'));
    expect(mockOnClearAll).toHaveBeenCalled();
  });
});