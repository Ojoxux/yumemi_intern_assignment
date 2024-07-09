import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { PrefecturePopulation } from '../../../types';

interface PopulationGraphProps {
  data: PrefecturePopulation[];
}

const PopulationGraph: React.FC<PopulationGraphProps> = ({ data }) => {
  console.log('Rendering PopulationGraph with data:', data);

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // 全都道府県のデータを1つの配列にマージ
  const mergedData = data[0].data.map((item) => {
    const yearData: { [key: string]: number } = { year: item.year };
    data.forEach((prefecture) => {
      const matchingData = prefecture.data.find((d) => d.year === item.year);
      yearData[prefecture.prefName] = matchingData ? matchingData.value : 0;
    });
    return yearData;
  });

  // 拡張された色のパレット
  const colors = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7300',
    '#a4de6c',
    '#d88488',
    '#8dd1e1',
    '#82ca9d',
    '#a4de6c',
    '#d0ed57',
    '#ffc658',
    '#ff7300',
    '#ff8e00',
    '#ffa500',
    '#ffb14e',
    '#ffbd6f',
    '#ffc58f',
    '#ffcea2',
    '#ffd7b5',
    '#ffe0c8',
    '#6a3d9a',
    '#b15928',
    '#e31a1c',
    '#fb9a99',
    '#1f78b4',
    '#33a02c',
    '#b2df8a',
    '#fb9a99',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a',
    '#ffff99',
    '#b15928',
    '#f781bf',
    '#999999',
    '#66c2a5',
    '#fc8d62',
    '#8da0cb',
    '#e78ac3',
    '#a6d854',
    '#ffd92f',
    '#e5c494',
    '#b3b3b3',
    '#7fc97f',
    '#beaed4',
    '#fdc086',
    '#ffff99',
    '#386cb0',
    '#f0027f',
  ];

  return (
    <div data-testid="population-graph" className="graph-container">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.map((prefecture, index) => (
            <Line
              key={prefecture.prefName}
              type="monotone"
              dataKey={prefecture.prefName}
              stroke={colors[index % colors.length]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopulationGraph;
