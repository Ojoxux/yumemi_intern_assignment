import { render, fireEvent } from '@testing-library/react';
import PrefectureSelector from './PrefectureSelector';

const mockPrefectures = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
];

describe('PrefectureSelector', () => {
  it('renders all prefectures', () => {
    const { getByLabelText } = render(
      <PrefectureSelector
        prefectures={mockPrefectures}
        selectedPrefectures={{}}
        onPrefectureChange={() => {}}
      />
    );
    expect(getByLabelText('北海道')).toBeInTheDocument();
    expect(getByLabelText('青森県')).toBeInTheDocument();
  });

  it('calls onPrefectureChange when a prefecture is selected', () => {
    const mockOnChange = jest.fn();
    const { getByLabelText } = render(
      <PrefectureSelector
        prefectures={mockPrefectures}
        selectedPrefectures={{}}
        onPrefectureChange={mockOnChange}
      />
    );
    fireEvent.click(getByLabelText('北海道'));
    expect(mockOnChange).toHaveBeenCalledWith(1, true);
  });
});