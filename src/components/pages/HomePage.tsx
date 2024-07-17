import React from 'react';
import BasicTemplate from '../templates/BasicTemplate';
import PrefectureSelector from '../organisms/PrefectureSelector/PrefectureSelector';
import PopulationGraph from '../organisms/PopulationGraph/PopulationGraph';
import Button from '../atoms/Button/Button';
import PopulationCategorySelector from '../molecules/PopulationCategorySelector/PopulationCategorySelector';
import { usePrefectureData } from '../../hooks/usePrefectureData';
import styles from './HomePage.module.css';
import Title from '../atoms/Title/Title';

const HomePage: React.FC = () => {
  const { 
    prefectures, 
    selectedPrefectures, 
    populationData, 
    handlePrefectureChange, 
    clearAllSelections,
    category,
    handleCategoryChange
  } = usePrefectureData();

  return (
    <BasicTemplate>
      <div className={styles.container}>
        <Title>都道府県別人口推移</Title>
        <div className={styles.selectorSection}>
          <PrefectureSelector
            prefectures={prefectures}
            selectedPrefectures={selectedPrefectures}
            onPrefectureChange={handlePrefectureChange}
          />
        </div>
        <div className={styles.clearButtonContainer}>
          <Button onClick={clearAllSelections}>選択をクリア</Button>
        </div>
        <div className={styles.graphSection}>
          <PopulationCategorySelector value={category} onChange={handleCategoryChange} />
          <PopulationGraph data={populationData} category={category} />
        </div>
      </div>
    </BasicTemplate>
  );
};

export default HomePage;