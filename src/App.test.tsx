import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('./services/api', () => ({
    fetchPrefectures: jest.fn().mockResolvedValue([{ prefCode: 1, prefName: '北海道' }]),
    fetchPopulation: jest.fn().mockResolvedValue([{ data: [{ year: 2020, value: 5000000 }] }]),
}));

describe('App', () => {
  it('renders without crashing', async () => {
    await waitFor(() => {
        render(<App />);
    });
    expect(screen.getByText('都道府県別人口推移')).toBeInTheDocument();
  });

  it('renders main components', async () => {
    await waitFor(() => {
        render(<App />);
    });
    expect(screen.getByText('選択をクリア')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});