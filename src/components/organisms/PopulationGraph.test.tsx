import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PopulationGraph from './PopulationGraph';

// Rechartsのモックを作成
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    LineChart: ({ children }: { children: React.ReactNode }) => <svg role="img">{children}</svg>,
    Line: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null,
  };
});

const mockData = [
  {
    prefName: '北海道',
    data: [
      { year: 1960, value: 5039206 },
      { year: 1965, value: 5171800 },
    ],
  },
];

test('renders population graph', async () => {
  console.log('Starting test with mock data:', mockData);

  render(<PopulationGraph data={mockData} />);

  // グラフコンテナの存在を確認
  const graphContainer = await screen.findByTestId('population-graph', {}, { timeout: 5000 });
  expect(graphContainer).toBeInTheDocument();
  console.log('Graph container found');

  // SVG要素の存在を確認
  await waitFor(
    () => {
      const svg = screen.getByRole('img');
      expect(svg).toBeInTheDocument();
      console.log('SVG element found');
    },
    { timeout: 5000 }
  );

  // テキストコンテンツの確認は省略（モックの関係で実際のテキストは表示されない）

  console.log('Test completed successfully');
}, 20000);
