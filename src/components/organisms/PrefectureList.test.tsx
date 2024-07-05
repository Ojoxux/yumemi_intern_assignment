import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrefectureList from './PrefectureList';

const mockPrefectures = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
];

describe('PrefectureList', () => {
  it('renders all prefectures', () => {
    render(
      <PrefectureList
        prefectures={mockPrefectures}
        selectedPrefectures={{}}
        onPrefectureChange={() => {}}
      />
    );
    expect(screen.getByText('北海道')).toBeInTheDocument();
    expect(screen.getByText('青森県')).toBeInTheDocument();
  });

  it('calls onPrefectureChange when a checkbox is clicked', () => {
    const mockOnPrefectureChange = jest.fn();
    render(
      <PrefectureList
        prefectures={mockPrefectures}
        selectedPrefectures={{}}
        onPrefectureChange={mockOnPrefectureChange}
      />
    );
    fireEvent.click(screen.getByLabelText('北海道'));
    expect(mockOnPrefectureChange).toHaveBeenCalledWith(1, true);
  });

  it('renders checkboxes as checked when in selectedPrefectures', () => {
    render(
      <PrefectureList
        prefectures={mockPrefectures}
        selectedPrefectures={{ 1: true }}
        onPrefectureChange={() => {}}
      />
    );
    expect(screen.getByLabelText('北海道')).toBeChecked();
    expect(screen.getByLabelText('青森県')).not.toBeChecked();
  });
});
