import { formatPopulationData } from '../dataProcessing';
import { PopulationData } from '../../types';

describe('formatPopulationData', () => {
  it('should round the value to the nearest integer', () => {
    const testData: PopulationData[] = [
      { year: 2020, value: 5000.4 },
      { year: 2021, value: 5100.6 },
    ];

    const result = formatPopulationData(testData);

    expect(result).toEqual([
      { year: 2020, value: 5000 },
      { year: 2021, value: 5101 },
    ]);
  });

  it('should handle empty array', () => {
    const result = formatPopulationData([]);
    expect(result).toEqual([]);
  });

  it('should not modify the year', () => {
    const testData: PopulationData[] = [
      { year: 2020, value: 5000 },
    ];

    const result = formatPopulationData(testData);

    expect(result[0].year).toBe(2020);
  });

  it('should handle large numbers', () => {
    const testData: PopulationData[] = [
      { year: 2020, value: 1234567890.5 },
    ];

    const result = formatPopulationData(testData);

    expect(result[0].value).toBe(1234567891);
  });

  it('should handle zero values', () => {
    const testData: PopulationData[] = [
      { year: 2020, value: 0 },
    ];

    const result = formatPopulationData(testData);

    expect(result[0].value).toBe(0);
  });

  it('should maintain the order of the input array', () => {
    const testData: PopulationData[] = [
      { year: 2020, value: 5000.4 },
      { year: 2019, value: 4900.6 },
      { year: 2021, value: 5100.5 },
    ];

    const result = formatPopulationData(testData);

    expect(result.map(item => item.year)).toEqual([2020, 2019, 2021]);
  });

  it('should handle undefined input', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const result = formatPopulationData(undefined);
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('Data is undefined');
    consoleSpy.mockRestore();
  });

  it('should handle null input', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const result = formatPopulationData(null as any);
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('Data is undefined');
    consoleSpy.mockRestore();
  });

  it('should handle non-array input', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const result = formatPopulationData('not an array' as any);
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('Data is not an array', 'string');
    consoleSpy.mockRestore();
  });

  it('should handle array with invalid items', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const testData = [
      { year: 2020, value: 5000 },
      'invalid item' as any,
      { year: 2021, value: 5100 },
      { year: 'invalid', value: 'invalid' } as any,
      { year: 2022, value: 5200 }
    ];
  
    const result = formatPopulationData(testData);
  
    expect(result).toEqual([
      { year: 2020, value: 5000 },
      { year: 2021, value: 5100 },
      { year: 2022, value: 5200 }
    ]);
    expect(consoleSpy).toHaveBeenCalledWith('Filtered out 2 invalid items from the data');
    consoleSpy.mockRestore();
  });
});