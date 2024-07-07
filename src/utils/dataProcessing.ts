import { PopulationData } from '../types';

export const formatPopulationData = (data: PopulationData[]): PopulationData[] => {
  // データフォーマットのロジックを実装
  return data.map(item => ({
    year: item.year,
    value: Math.round(item.value)
  }));
};