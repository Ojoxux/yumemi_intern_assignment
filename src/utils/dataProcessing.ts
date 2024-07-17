import { PopulationData } from '../types';

export const formatPopulationData = (data: PopulationData[] | undefined): PopulationData[] => {
  if (!data) {
    console.error('Data is undefined');
    return [];
  }
  if (!Array.isArray(data)) {
    console.error('Data is not an array',typeof data);
    return [];
  }
  
  const validData = data.filter((item): item is PopulationData => 
    typeof item === 'object' && item !== null && 
    typeof item.year === 'number' && 
    typeof item.value === 'number'
  );

  if (validData.length !== data.length) {
    console.warn(`Filtered out ${data.length - validData.length} invalid items from the data`);
  }

  return validData.map(item => ({
    year: item.year,
    value: Math.round(item.value)
  }));
};