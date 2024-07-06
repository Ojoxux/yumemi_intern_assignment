import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

// Mock the custom hook
jest.mock('../../hooks/usePrefectureData', () => ({
  usePrefectureData: () => ({
    prefectures: [{ prefCode: 1, prefName: '北海道' }],
    selectedPrefectures: {},
    populationData: [],
    handlePrefectureChange: jest.fn(),
  }),
}));

describe('HomePage', () => {
  it('renders HomePage with PrefectureSelector and PopulationGraph', () => {
    render(<HomePage />);
    expect(screen.getByText('都道府県別人口推移')).toBeInTheDocument();
    expect(screen.getByLabelText('北海道')).toBeInTheDocument();
    expect(screen.getByText('データがありません')).toBeInTheDocument(); // Check for the no data message
  });
});