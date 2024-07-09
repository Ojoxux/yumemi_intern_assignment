import React from 'react';
import BasicTemplate from '../templates/BasicTemplate';
import PrefectureSelector from '../organisms/PrefectureSelector/PrefectureSelector';
import PopulationGraph from '../organisms/PopulationGraph/PopulationGraph';
import Button from '../atoms/Button/Button';
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
        <Button onClick={clearAllSelections}>選択をクリア</Button>
      </div>
      <PopulationGraph data={populationData} />
    </BasicTemplate>
  );
};

export default HomePage;