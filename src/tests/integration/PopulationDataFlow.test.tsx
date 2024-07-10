import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../../src/App';
import { fetchPrefectures, fetchPopulation } from '../../../src/services/api';

jest.mock('../../../src/services/api');

describe('Population Data Flow', () => {
  beforeEach(() => {
    (fetchPrefectures as jest.Mock).mockResolvedValue([
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 2, prefName: '青森県' },
    ]);
    (fetchPopulation as jest.Mock).mockResolvedValue([
      { data: [{ year: 2015, value: 5381733 }, { year: 2020, value: 5224614 }] }
    ]);
  });

  it('displays prefecture options and updates graph on selection', async () => {
    render(<App />);

    // Wait for prefecture options to load
    await waitFor(() => {
      expect(screen.getByText('北海道')).toBeInTheDocument();
    });

    // Select a prefecture
    fireEvent.click(screen.getByLabelText('北海道'));

    // Wait for graph to update
    await waitFor(() => {
      expect(screen.queryByText('No data available')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    // Check if any graph-related content is present
    expect(screen.getByTestId('population-graph')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    (fetchPopulation as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('北海道')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('北海道'));

    await waitFor(() => {
      expect(screen.getByText('No data available')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});