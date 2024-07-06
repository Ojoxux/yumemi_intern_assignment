import React from 'react';
import BasicTemplate from '../../components/templates/BasicTemplate';
import PrefectureSelector from '../../components/organisms/PrefectureSelector';
import PopulationGraph from '../../components/organisms/PopulationGraph';
import { usePrefectureData } from '../../hooks/usePrefectureData';

const HomePage: React.FC = () => {
  const { prefectures, selectedPrefectures, populationData, handlePrefectureChange, clearAllSelections } = usePrefectureData();

  return (
    <BasicTemplate>
      <PrefectureSelector
        prefectures={prefectures}
        selectedPrefectures={selectedPrefectures}
        onPrefectureChange={handlePrefectureChange}
        onClearAll={clearAllSelections}
      />
      <PopulationGraph data={populationData} />
    </BasicTemplate>
  );
};

export default HomePage;