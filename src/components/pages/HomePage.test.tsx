import { render, fireEvent, screen } from '@testing-library/react';
import HomePage from './HomePage';
import { usePrefectureData } from '../../hooks/usePrefectureData';

jest.mock('../../hooks/usePrefectureData');

describe('HomePage', () => {
  beforeEach(() => {
    (usePrefectureData as jest.Mock).mockReturnValue({
      prefectures: [{ prefCode: 1, prefName: '北海道' }],
      selectedPrefectures: {},
      populationData: [],
      handlePrefectureChange: jest.fn(),
      clearAllSelections: jest.fn(),
    });
  });

  it('renders clear button', () => {
    render(<HomePage />);
    expect(screen.getByText('全て外す')).toBeInTheDocument();
  });

  it('calls clearAllSelections when clear button is clicked', () => {
    const mockClearAllSelections = jest.fn();
    (usePrefectureData as jest.Mock).mockReturnValue({
      prefectures: [{ prefCode: 1, prefName: '北海道' }],
      selectedPrefectures: {},
      populationData: [],
      handlePrefectureChange: jest.fn(),
      clearAllSelections: mockClearAllSelections,
    });

    render(<HomePage />);
    fireEvent.click(screen.getByText('選択をクリア'));
    expect(mockClearAllSelections).toHaveBeenCalled();
  });
});