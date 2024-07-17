import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { fetchPrefectures, fetchPopulation } from '../../services/api';

// APIのモック
jest.mock('../../services/api');

const mockPrefectures = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
];

const mockPopulationData = {
  総人口: [{ year: 2020, value: 5000000 }],
  年少人口: [{ year: 2020, value: 1000000 }],
  生産年齢人口: [{ year: 2020, value: 3000000 }],
  老年人口: [{ year: 2020, value: 1000000 }],
};

describe('Prefecture Selection Integration', () => {
  beforeEach(() => {
    (fetchPrefectures as jest.Mock).mockResolvedValue(mockPrefectures);
    (fetchPopulation as jest.Mock).mockResolvedValue(mockPopulationData);
  });

  it('selects a prefecture and displays its population data', async () => {
    render(<App />);

    // Wait for prefectures to load
    await waitFor(() => expect(screen.getByText('北海道')).toBeInTheDocument());

    // Select a prefecture
    const checkbox = screen.getByLabelText('北海道');
    userEvent.click(checkbox);

    // Wait for population data to load
    await waitFor(() => {
      const noDataElement = screen.queryByTestId('population-graph-no-data');
      const graphElement = screen.queryByTestId('population-graph');
      expect(noDataElement).not.toBeInTheDocument();
      expect(graphElement).toBeInTheDocument();
    }, { timeout: 5000 });

    // Check if the graph is displayed
    expect(screen.getByTestId('population-graph')).toBeInTheDocument();
  });

  it('clears all selections', async () => {
    render(<App />);

    // Wait for prefectures to load
    await waitFor(() => expect(screen.getByText('北海道')).toBeInTheDocument());

    // Select prefectures
    const hokkaido = screen.getByLabelText('北海道');
    const aomori = screen.getByLabelText('青森県');
    userEvent.click(hokkaido);
    userEvent.click(aomori);

    // Wait for population data to load
    await waitFor(() => {
      const noDataElement = screen.queryByTestId('population-graph-no-data');
      const graphElement = screen.queryByTestId('population-graph');
      expect(noDataElement).not.toBeInTheDocument();
      expect(graphElement).toBeInTheDocument();
    }, { timeout: 5000 });

    // Clear selections
    const clearButton = screen.getByText('選択をクリア');
    userEvent.click(clearButton);

    // Check if selections are cleared
    await waitFor(() => {
      expect(hokkaido).not.toBeChecked();
      expect(aomori).not.toBeChecked();
    });

    // Check if the graph is not displayed and "No data available" is shown
    await waitFor(() => {
      expect(screen.queryByTestId('population-graph')).not.toBeInTheDocument();
      expect(screen.getByTestId('population-graph-no-data')).toBeInTheDocument();
    });
  });
});