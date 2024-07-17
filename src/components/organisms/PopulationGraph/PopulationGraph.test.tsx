import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PopulationGraph, { formatYAxis, formatTooltip } from './PopulationGraph';
import { PopulationCategory } from '../../../types';
import { PrefecturePopulation } from '../../../types';

const defaultCategory: PopulationCategory = '総人口';

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    LineChart: React.forwardRef<any, { children: React.ReactNode }>((props, ref) => (
      <svg role="img" ref={ref}>{props.children}</svg>
    )),
    Line: () => <g role="presentation" />,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null,
  };
});

const mockData: PrefecturePopulation[] = [
  {
    prefName: '北海道',
    data: [
      { year: 1960, value: 5039206 },
      { year: 1965, value: 5171800 },
    ],
  },
];

test('renders population graph', async () => {
  render(<PopulationGraph data={mockData} category={defaultCategory}/>);

  await waitFor(() => {
    expect(screen.getByTestId('population-graph')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});

test('displays "No data available" when no data is provided', () => {
  render(<PopulationGraph data={[]} category={defaultCategory} />);
  expect(screen.getByTestId('population-graph-no-data')).toHaveTextContent('No data available');
});

test('renders graph with multiple prefectures', async () => {
  const multiPrefData: PrefecturePopulation[] = [
    {
      prefName: '北海道',
      data: [
        { year: 1960, value: 5039206 },
        { year: 1965, value: 5171800 },
      ],
    },
    {
      prefName: '東京都',
      data: [
        { year: 1960, value: 9683802 },
        { year: 1965, value: 10869244 },
      ],
    },
  ];

  render(<PopulationGraph data={multiPrefData} category={defaultCategory} />);

  // グラフコンテナの存在を確認
  const graphContainer = await screen.findByTestId('population-graph');
  expect(graphContainer).toBeInTheDocument();

  // SVG要素の存在を確認
  const svg = await screen.findByRole('img');
  expect(svg).toBeInTheDocument();

  // 注意: 実際のLineコンポーネントの存在は確認できませんが、
  // データが正しく渡されていることを確認するためのログを追加
  console.log('Rendered PopulationGraph with data:', multiPrefData);
});

test('handles data with missing years gracefully', async () => {
  const irregularData: PrefecturePopulation[] = [
    {
      prefName: '沖縄県',
      data: [
        { year: 1960, value: 883122 },
        // 1965年のデータが欠落
        { year: 1970, value: 945111 },
      ],
    },
  ];

  render(<PopulationGraph data={irregularData} category={defaultCategory} />);

  // グラフコンテナの存在を確認
  const graphContainer = await screen.findByTestId('population-graph');
  expect(graphContainer).toBeInTheDocument();

  // SVG要素の存在を確認
  const svg = await screen.findByRole('img');
  expect(svg).toBeInTheDocument();

  // データが正しく渡されていることを確認するためのログを追加
  console.log('Rendered PopulationGraph with irregular data:', irregularData);
});

test('handles data with missing values gracefully', async () => {
  const dataWithMissingValues: PrefecturePopulation[] = [
    {
      prefName: '東京都',
      data: [
        { year: 1960, value: 9683802 },
        { year: 1965, value: 10869244 },
      ],
    },
    {
      prefName: '大阪府',
      data: [
        { year: 1960, value: 5504746 },
        // 1965年のデータが欠落
      ],
    },
  ];

  render(<PopulationGraph data={dataWithMissingValues} category={defaultCategory} />);

  // グラフコンテナの存在を確認
  const graphContainer = await screen.findByTestId('population-graph');
  expect(graphContainer).toBeInTheDocument();

  // SVG要素の存在を確認
  const svg = await screen.findByRole('img');
  expect(svg).toBeInTheDocument();

  // データが正しく渡されていることを確認するためのログを追加
  console.log('Rendered PopulationGraph with data containing missing values:', dataWithMissingValues);
});

test('renders graph with data spanning different year ranges', async () => {
  const dataWithDifferentYearRanges: PrefecturePopulation[] = [
    {
      prefName: '東京都',
      data: [
        { year: 1960, value: 9683802 },
        { year: 1965, value: 10869244 },
        { year: 1970, value: 11408071 },
      ],
    },
    {
      prefName: '大阪府',
      data: [
        { year: 1965, value: 6657189 },
        { year: 1970, value: 7620480 },
        { year: 1975, value: 8278925 },
      ],
    },
  ];

  render(<PopulationGraph data={dataWithDifferentYearRanges} category={defaultCategory}/>);

  // グラフコンテナの存在を確認
  const graphContainer = await screen.findByTestId('population-graph');
  expect(graphContainer).toBeInTheDocument();

  // SVG要素の存在を確認
  const svg = await screen.findByRole('img');
  expect(svg).toBeInTheDocument();

  // データが正しく渡されていることを確認するためのログを追加
  console.log('Rendered PopulationGraph with data spanning different year ranges:', dataWithDifferentYearRanges);
});

describe('formatYAxis', () => {
  test('formats numbers less than 10000', () => {
    expect(formatYAxis(5000)).toBe('5000');
  });

  test('formats numbers between 10000 and 999999', () => {
    expect(formatYAxis(50000)).toBe('5万');
  });

  test('formats numbers 1000000 or greater', () => {
    expect(formatYAxis(1500000)).toBe('150万');
  });
});

describe('formatTooltip', () => {
  test('formats number with comma separator and adds 人', () => {
    expect(formatTooltip(1234567)).toEqual(['1,234,567', '人']);
  });
});

test('useEffect hook updates chart when category changes', async () => {
  const { rerender } = render(<PopulationGraph data={mockData} category={defaultCategory} />);  
  // カテゴリを変更してコンポーネントを再レンダリング
  rerender(<PopulationGraph data={mockData} category="年少人口" />);
  
  await waitFor(() => {
    expect(screen.getByTestId('population-graph')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});

test('renders correct number of Line components', () => {
  render(<PopulationGraph data={mockData} category={defaultCategory} />);
  const lineElements = screen.getAllByRole('presentation');
  expect(lineElements.length).toBe(mockData.length);
});