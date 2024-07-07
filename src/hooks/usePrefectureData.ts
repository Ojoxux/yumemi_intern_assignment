import { useState, useEffect } from 'react';
import { fetchPrefectures, fetchPopulation } from '../services/api';
import { Prefecture, PrefecturePopulation } from '../types';
import { formatPopulationData } from '../utils/dataProcessing';

export const usePrefectureData = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<Record<number, boolean>>({});
  const [populationData, setPopulationData] = useState<PrefecturePopulation[]>([]);

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

  const handlePrefectureChange = async (prefCode: number, checked: boolean) => {
    setSelectedPrefectures((prev) => ({ ...prev, [prefCode]: checked }));

    if (checked) {
      try {
        const data = await fetchPopulation(prefCode);
        const prefName = prefectures.find((pref) => pref.prefCode === prefCode)?.prefName || '';
        const formattedData = formatPopulationData(data[0].data);
        setPopulationData((prev) => [...prev, { prefName, data: formattedData }]);
      } catch (error) {
        console.error('Failed to fetch population data:', error);
      }
    } else {
      setPopulationData((prev) =>
        prev.filter(
          (item) =>
            item.prefName !== prefectures.find((pref) => pref.prefCode === prefCode)?.prefName
        )
      );
    }
  };

  const clearAllSelections = () => {
    setSelectedPrefectures({});
    setPopulationData([]);
  };

  return { prefectures, selectedPrefectures, populationData, handlePrefectureChange, clearAllSelections };
};