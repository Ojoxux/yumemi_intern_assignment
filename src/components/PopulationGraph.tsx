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

interface PopulationData {
  year: number;
  value: number;
}

interface PopulationGraphProps {
  data: {
    prefName: string;
    data: PopulationData[];
  }[];
}

const PopulationGraph: React.FC<PopulationGraphProps> = ({ data }) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c'];

  const formattedData = data[0]?.data.map((item) => ({
    year: item.year,
    ...data.reduce(
      (acc, prefecture) => {
        acc[prefecture.prefName] = prefecture.data.find((d) => d.year === item.year)?.value || 0;
        return acc;
      },
      {} as { [key: string]: number }
    ),
  }));

  return (
    <div className="graph-container">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formattedData}>
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
