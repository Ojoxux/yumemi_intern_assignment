import { useState, useEffect, useCallback } from 'react';
import { fetchPrefectures, fetchPopulation } from '../services/api';
import { Prefecture, PrefecturePopulation, PopulationCategory } from '../types';
import { formatPopulationData } from '../utils/dataProcessing';

export const usePrefectureData = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<Record<number, boolean>>({});
  const [populationData, setPopulationData] = useState<Record<PopulationCategory, PrefecturePopulation[]>>({
    総人口: [],
    年少人口: [],
    生産年齢人口: [],
    老年人口: [],
  });
  const [category, setCategory] = useState<PopulationCategory>('総人口');

  useEffect(() => {
    const loadPrefectures = async () => {
      try {
        const data = await fetchPrefectures();
        setPrefectures(data);
      } catch (error) {
        console.error('Failed to fetch prefectures:', error);
      }
    };
    loadPrefectures();
  }, []);

  const fetchPrefectureData = useCallback(async (prefCode: number) => {
    try {
      const data = await fetchPopulation(prefCode);
      const prefName = prefectures.find((pref) => pref.prefCode === prefCode)?.prefName || '';
      return Object.entries(data).reduce((acc, [key, value]) => {
        acc[key as PopulationCategory] = { prefName, data: formatPopulationData(value) };
        return acc;
      }, {} as Record<PopulationCategory, PrefecturePopulation>);
    } catch (error) {
      console.error('Failed to fetch population data:', error);
      if (error instanceof Error) {
        console.error('Error message: ', error.message);
        console.error('Error stack: ', error.stack);
      }
      return null;
    }
  }, [prefectures]);

  const handlePrefectureChange = useCallback(async (prefCode: number, checked: boolean) => {
    setSelectedPrefectures((prev) => ({ ...prev, [prefCode]: checked }));

    if (checked) {
      const newData = await fetchPrefectureData(prefCode);
      if (newData) {
        setPopulationData((prev) => {
          const updated = { ...prev };
          Object.entries(newData).forEach(([cat, data]) => {
            updated[cat as PopulationCategory] = [...updated[cat as PopulationCategory], data];
          });
          return updated;
        });
      }
    } else {
      setPopulationData((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((cat) => {
          updated[cat as PopulationCategory] = updated[cat as PopulationCategory].filter(
            (item) => item.prefName !== prefectures.find((pref) => pref.prefCode === prefCode)?.prefName
          );
        });
        return updated;
      });
    }
  }, [prefectures, fetchPrefectureData]);

  const clearAllSelections = useCallback(() => {
    setSelectedPrefectures({});
    setPopulationData({
      総人口: [],
      年少人口: [],
      生産年齢人口: [],
      老年人口: [],
    });
  }, []);

  const handleCategoryChange = useCallback((newCategory: PopulationCategory) => {
    setCategory(newCategory);
  }, []);

  return { 
    prefectures, 
    selectedPrefectures, 
    populationData: populationData[category], 
    handlePrefectureChange, 
    clearAllSelections,
    category,
    handleCategoryChange
  };
};