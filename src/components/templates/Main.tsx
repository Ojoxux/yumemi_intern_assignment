import React, { useState, useEffect } from 'react';
import { fetchPrefectures, fetchPopulation } from '../../services/api';
import Header from '../molecules/Header';
import PrefectureList from '../organisms/PrefectureList';
import PopulationGraph from '../organisms/PopulationGraph';

const Main: React.FC = () => {
  const [prefectures, setPrefectures] = useState<{ prefCode: number; prefName: string }[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<{ [key: number]: boolean }>({});
  const [populationData, setPopulationData] = useState<
    { prefName: string; data: { year: number; value: number }[] }[]
  >([]);

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
        setPopulationData((prev) => [...prev, { prefName, data: data[0].data }]);
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

  return (
    <div className="container mx-auto">
      <Header />
      <main className="mt-4">
      <PrefectureList
        prefectures={prefectures}
        selectedPrefectures={selectedPrefectures}
        onPrefectureChange={handlePrefectureChange}
      />
      <PopulationGraph data={populationData} />
      </main>
    </div>
  );
};

export default Main;
