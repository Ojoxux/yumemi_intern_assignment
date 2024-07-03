import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrefectureList from '../PrefectureList';

const mockPrefectures = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
];

test('renders prefecture list', () => {
  const mockOnChange = jest.fn();
  render(
    <PrefectureList
      prefectures={mockPrefectures}
      onPrefectureChange={mockOnChange}
      selectedPrefectures={{}}
    />
  );

  expect(screen.getByText('北海道')).toBeInTheDocument();
  expect(screen.getByText('青森県')).toBeInTheDocument();
});

test('calls onPrefectureChange when checkbox is clicked', () => {
  const mockOnChange = jest.fn();
  render(
    <PrefectureList
      prefectures={mockPrefectures}
      onPrefectureChange={mockOnChange}
      selectedPrefectures={{}}
    />
  );

  const checkbox = screen.getByLabelText('北海道');
  fireEvent.click(checkbox);

  expect(mockOnChange).toHaveBeenCalledWith(1, true);
});
