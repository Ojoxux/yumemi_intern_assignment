import React from 'react';
import SelectBox from '../../atoms/SelectBox/SelectBox';
import { PopulationCategory } from '../../../types';
import styles from './PopulationCategorySelector.module.css';

interface PopulationCategorySelectorProps {
  value: PopulationCategory;
  onChange: (category: PopulationCategory) => void;
}

const categoryOptions = [
  { value: '総人口', label: '総人口' },
  { value: '年少人口', label: '年少人口' },
  { value: '生産年齢人口', label: '生産年齢人口' },
  { value: '老年人口', label: '老年人口' },
];

const PopulationCategorySelector: React.FC<PopulationCategorySelectorProps> = ({ value, onChange }) => {
  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="population-category">人口カテゴリ：</label>
      <SelectBox
        id="population-category"
        options={categoryOptions}
        value={value}
        onChange={(newValue) => onChange(newValue as PopulationCategory)}
      />
    </div>
  );
};

export default PopulationCategorySelector;