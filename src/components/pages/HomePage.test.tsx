import { fireEvent, render, screen } from '@testing-library/react';
import HomePage from './HomePage';

// Mock the custom hook
jest.mock('../../hooks/usePrefectureData', () => ({
  usePrefectureData: () => ({
    prefectures: [{ prefCode: 1, prefName: '北海道' }],
    selectedPrefectures: {},
    populationData: [],
    handlePrefectureChange: jest.fn(),
    clearAllSelections: jest.fn(),
  }),
}));

test('renders clear button' , () => {
    const { getByText } = render(<HomePage />);
    expect(getByText('全て外す')).toBeInTheDocument();
});

test('clear button calls clearAllSelections', () => {
    const { getByText } = render(<HomePage />);
    const clearButton = getByText('全て外す');
    fireEvent.click(clearButton);
});

describe('HomePage', () => {
    it('renders clear button', () => {
      render(<HomePage />);
      expect(screen.getByText('選択をクリア')).toBeInTheDocument();
    });
  
    it('calls clearAllSelections when clear button is clicked', () => {
      const { usePrefectureData } = require('../hooks/usePrefectureData');
      const mockClearAllSelections = jest.fn();
      usePrefectureData.mockReturnValue({
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