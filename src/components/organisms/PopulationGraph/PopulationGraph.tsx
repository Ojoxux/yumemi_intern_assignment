import React, { useState, useEffect } from 'react';
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
import { PrefecturePopulation, PopulationCategory } from '../../../types';
import styles from './PopulationGraph.module.css';

interface PopulationGraphProps {
  data: PrefecturePopulation[];
  category: PopulationCategory;
}

export const formatYAxis = (value: number): string => {
  if (value >= 1000000) {
    const hundredThousands = Math.floor(value / 100000);
    return `${hundredThousands * 10}万`;
  } else if (value >= 10000) {
    return `${Math.floor(value / 10000)}万`;
  }
  return value.toString();
};

export const formatTooltip = (value: number): [string, string] => {
  return [value.toLocaleString(), '人'];
};

const PopulationGraph: React.FC<PopulationGraphProps> = ({ data, category }) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [category]);

  if (data.length === 0) {
    return <div data-testid="population-graph-no-data">No data available</div>;
  }

  const mergedData = data[0].data.map((item) => {
    const yearData: { [key: string]: number } = { year: item.year };
    data.forEach((prefecture) => {
      const matchingData = prefecture.data.find((d) => d.year === item.year);
      yearData[prefecture.prefName] = matchingData ? matchingData.value : 0;
    });
    return yearData;
  });

  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c',
    '#d88488', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'
  ];

  return (
    <div data-testid="population-graph" className={styles.container}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart key={key} data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={formatYAxis} />
          <Tooltip formatter={formatTooltip} />
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