import { renderHook, act, waitFor } from '@testing-library/react';
import { usePrefectureData } from './usePrefectureData';
import { fetchPrefectures, fetchPopulation } from '../services/api';
import { PopulationCategory } from '../types';

jest.mock('../services/api');
jest.mock('../utils/dataProcessing', () => ({
  formatPopulationData: (data: any) => data
}));

describe('usePrefectureData', () => {
  beforeEach(() => {
    (fetchPrefectures as jest.Mock).mockResolvedValue([
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 2, prefName: '青森県' }
    ]);
    (fetchPopulation as jest.Mock).mockResolvedValue({
      総人口: [{ year: 2020, value: 5000000 }],
      年少人口: [{ year: 2020, value: 500000 }],
      生産年齢人口: [{ year: 2020, value: 3000000 }],
      老年人口: [{ year: 2020, value: 1500000 }]
    });
  });

  it('fetches prefectures on mount', async () => {
    const { result } = renderHook(() => usePrefectureData());
    
    await waitFor(() => {
      expect(result.current.prefectures).toHaveLength(2);
    });
  });

  it('fetches population data when prefecture is selected', async () => {
    const { result } = renderHook(() => usePrefectureData());

    await waitFor(() => expect(result.current.prefectures).toHaveLength(2));

    await act(async () => {
      await result.current.handlePrefectureChange(1, true);
    });

    await waitFor(() => {
      expect(result.current.populationData).toHaveLength(1);
      expect(result.current.populationData[0].prefName).toBe('北海道');
    });
  });

  it('removes population data when prefecture is deselected', async () => {
    const { result } = renderHook(() => usePrefectureData());

    await waitFor(() => expect(result.current.prefectures).toHaveLength(2));

    await act(async () => {
      await result.current.handlePrefectureChange(1, true);
      await result.current.handlePrefectureChange(1, false);
    });

    await waitFor(() => {
      expect(result.current.populationData).toHaveLength(0);
    });
  });

  it('handles multiple prefecture selections and deselections', async () => {
    const { result } = renderHook(() => usePrefectureData());

    await waitFor(() => expect(result.current.prefectures).toHaveLength(2));

    await act(async () => {
      await result.current.handlePrefectureChange(1, true);
      await result.current.handlePrefectureChange(2, true);
      await result.current.handlePrefectureChange(1, false);
    });

    await waitFor(() => {
      expect(result.current.populationData).toHaveLength(1);
      expect(result.current.populationData[0].prefName).toBe('青森県');
    });
  });

  it('handles category change', async () => {
    const { result } = renderHook(() => usePrefectureData());

    await waitFor(() => expect(result.current.prefectures).toHaveLength(2));

    await act(async () => {
      await result.current.handlePrefectureChange(1, true);
      result.current.handleCategoryChange('年少人口' as PopulationCategory);
    });

    await waitFor(() => {
      expect(result.current.category).toBe('年少人口');
      expect(result.current.populationData).toHaveLength(1);
    });
  });

  it('clears all selections', async () => {
    const { result } = renderHook(() => usePrefectureData());

    await waitFor(() => expect(result.current.prefectures).toHaveLength(2));

    await act(async () => {
      await result.current.handlePrefectureChange(1, true);
      await result.current.handlePrefectureChange(2, true);
      result.current.clearAllSelections();
    });

    await waitFor(() => {
      expect(result.current.populationData).toHaveLength(0);
      expect(result.current.selectedPrefectures).toEqual({});
    });
  });

  it('handles API error gracefully', async () => {
    console.error = jest.fn();
    (fetchPrefectures as jest.Mock).mockRejectedValue(new Error('API Error'));

    renderHook(() => usePrefectureData());

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to fetch prefectures:', expect.any(Error));
    });
  });

  it('handles invalid data format from fetchPopulation', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (fetchPrefectures as jest.Mock).mockResolvedValue([{ prefCode: 1, prefName: '北海道' }]);
    (fetchPopulation as jest.Mock).mockResolvedValue('invalid data');

    const { result } = renderHook(() => usePrefectureData());

    await waitFor(() => expect(result.current.prefectures).toHaveLength(1));

    await act(async () => {
      await result.current.handlePrefectureChange(1, true);
    });

    expect(consoleSpy).toHaveBeenCalledWith('Invalid data format:', 'invalid data');
    expect(result.current.populationData).toHaveLength(0);

    consoleSpy.mockRestore();
  });

  it('initializes empty array for population category if it is not an array', async () => {
    (fetchPrefectures as jest.Mock).mockResolvedValue([{ prefCode: 1, prefName: '北海道' }]);
    (fetchPopulation as jest.Mock).mockResolvedValue({
      総人口: [{ year: 2020, value: 5000000 }],
      年少人口: 'not an array', // この無効なデータ形式をテストに使用
      生産年齢人口: [{ year: 2020, value: 3000000 }],
      老年人口: [{ year: 2020, value: 1500000 }]
    });
  
    const { result } = renderHook(() => usePrefectureData());
  
    await waitFor(() => expect(result.current.prefectures).toHaveLength(1));
  
    await act(async () => {
      await result.current.handlePrefectureChange(1, true);
    });
  
    // 総人口カテゴリのデータが正しく設定されていることを確認
    expect(result.current.populationData).toHaveLength(1);
    expect(result.current.populationData[0].prefName).toBe('北海道');
  
    // 年少人口カテゴリに切り替え
    act(() => {
      result.current.handleCategoryChange('年少人口' as PopulationCategory);
    });
  
    // 年少人口カテゴリのデータが空の配列になっていることを確認
    expect(result.current.populationData).toHaveLength(0);
  
    // 生産年齢人口カテゴリに切り替え
    act(() => {
      result.current.handleCategoryChange('生産年齢人口' as PopulationCategory);
    });
  
    // 生産年齢人口カテゴリのデータが正しく設定されていることを確認
    expect(result.current.populationData).toHaveLength(1);
    expect(result.current.populationData[0].prefName).toBe('北海道');
  });
});