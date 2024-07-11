import { renderHook, act, waitFor } from '@testing-library/react';
import { usePrefectureData } from './usePrefectureData';
import { fetchPrefectures, fetchPopulation } from '../services/api';
import { formatPopulationData } from '../utils/dataProcessing';

jest.mock('../services/api');
jest.mock('../utils/dataProcessing');

describe('usePrefectureData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches prefectures on mount', async () => {
    const mockPrefectures = [{ prefCode: 1, prefName: '北海道' }];
    (fetchPrefectures as jest.Mock).mockResolvedValue(mockPrefectures);

    const { result } = renderHook(() => usePrefectureData());
    
    await act(async () => {
      // Wait for useEffect to complete
    });

    expect(result.current.prefectures).toEqual(mockPrefectures);
  });

  it('handles API error gracefully', async () => {
    console.error = jest.fn();
    (fetchPrefectures as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => usePrefectureData());

    await act(async () => {
      // Wait for useEffect to complete
    });

    expect(result.current.prefectures).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Failed to fetch prefectures:', expect.any(Error));
  });

  it('fetches population data when prefecture is selected', async () => {
    const mockPrefectures = [{ prefCode: 1, prefName: '北海道' }];
    const mockPopulationData = [{ data: [{ year: 2020, value: 5000000 }] }];
    const mockFormattedData = [{ year: 2020, value: 5000000 }];
    (fetchPrefectures as jest.Mock).mockResolvedValue(mockPrefectures);
    (fetchPopulation as jest.Mock).mockResolvedValue(mockPopulationData);
    (formatPopulationData as jest.Mock).mockReturnValue(mockFormattedData);

    const { result } = renderHook(() => usePrefectureData());

    await act(async () => {
      // Wait for useEffect to complete
    });

    act(() => {
      result.current.handlePrefectureChange(1, true);
    });

    await act(async () => {
      // Wait for handlePrefectureChange to complete
    });

    expect(result.current.populationData).toEqual([
      { prefName: '北海道', data: mockFormattedData },
    ]);
  });

  it('clears all selections', async () => {
    const mockPrefectures = [
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 2, prefName: '青森県' },
    ];
    (fetchPrefectures as jest.Mock).mockResolvedValue(mockPrefectures);

    const { result } = renderHook(() => usePrefectureData());

    await act(async () => {
      // Wait for useEffect to complete
    });

    act(() => {
      result.current.handlePrefectureChange(1, true);
      result.current.handlePrefectureChange(2, true);
    });

    act(() => {
      result.current.clearAllSelections();
    });

    expect(result.current.selectedPrefectures).toEqual({});
    expect(result.current.populationData).toEqual([]);
  });

  it('handles population data fetch error', async () => {
    console.error = jest.fn();
    const mockPrefectures = [{ prefCode: 1, prefName: '北海道' }];
    (fetchPrefectures as jest.Mock).mockResolvedValue(mockPrefectures);
    (fetchPopulation as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => usePrefectureData());

    await act(async () => {
      await result.current.handlePrefectureChange(1, true);
    });

    expect(console.error).toHaveBeenCalledWith('Failed to fetch population data:', expect.any(Error));
    expect(result.current.populationData).toEqual([]);
  });

  it('removes population data when prefecture is deselected', async () => {
    const mockPrefectures = [{ prefCode: 1, prefName: '北海道' }];
    const mockPopulationData = [{ data: [{ year: 2020, value: 5000000 }] }];
    const mockFormattedData = [{ year: 2020, value: 5000000 }];
    (fetchPrefectures as jest.Mock).mockResolvedValue(mockPrefectures);
    (fetchPopulation as jest.Mock).mockResolvedValue(mockPopulationData);
    (formatPopulationData as jest.Mock).mockReturnValue(mockFormattedData);
  
    const { result } = renderHook(() => usePrefectureData());
  
    await waitFor(() => expect(result.current.prefectures).toEqual(mockPrefectures));

    await act(async () => {
      await result.current.handlePrefectureChange(1, true);
    });
  
    await waitFor (() => expect(result.current.populationData).toHaveLength(1));
    
    await act(async () => {
      await result.current.handlePrefectureChange(1, false);
    });
  
    await waitFor(() => expect(result.current.populationData).toHaveLength(0));
  });

  it('handles prefecture selection when prefecture is not found', async () => {
    const mockPrefectures = [{ prefCode: 1, prefName: '北海道' }];
    const mockPopulationData = [{ data: [{ year: 2020, value: 5000000 }] }];
    const mockFormattedData = [{ year: 2020, value: 5000000 }];
    (fetchPrefectures as jest.Mock).mockResolvedValue(mockPrefectures);
    (fetchPopulation as jest.Mock).mockResolvedValue(mockPopulationData);
    (formatPopulationData as jest.Mock).mockReturnValue(mockFormattedData);
  
    const { result } = renderHook(() => usePrefectureData());
  
    await waitFor(() => expect(result.current.prefectures).toEqual(mockPrefectures));

    await act(async () => {
      // Try to select a prefecture that doesn't exist
      await result.current.handlePrefectureChange(999, true);
    });
  
    await waitFor(() => {
      expect(result.current.populationData).toHaveLength(1);
      expect(result.current.populationData[0].prefName).toBe('');
    });
});
});