import React from 'react';
import BasicTemplate from '../../components/templates/BasicTemplate';
import PrefectureSelector from '../../components/organisms/PrefectureSelector';
import PopulationGraph from '../../components/organisms/PopulationGraph';
import Button from '../../components/atoms/Button';
import { usePrefectureData } from '../../hooks/usePrefectureData';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const { prefectures, selectedPrefectures, populationData, handlePrefectureChange, clearAllSelections } = usePrefectureData();

  return (
    <BasicTemplate>
      <PrefectureSelector
        prefectures={prefectures}
        selectedPrefectures={selectedPrefectures}
        onPrefectureChange={handlePrefectureChange}
      />
      <div className={styles.clearButtonContainer}>
        <Button onClick={clearAllSelections}>全て外す</Button>
      </div>
      <PopulationGraph data={populationData} />
    </BasicTemplate>
  );
};

export default HomePage;