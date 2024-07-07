import React from 'react';
import CheckboxWithLabel from '../molecules/CheckboxWithLabel';
import { Prefecture } from '../../types';
import styles from './PrefectureSelector.module.css';

interface PrefectureSelectorProps {
  prefectures: Prefecture[];
  selectedPrefectures: Record<number, boolean>;
  onPrefectureChange: (prefCode: number, checked: boolean) => void;
}

const PrefectureSelector: React.FC<PrefectureSelectorProps> = ({
  prefectures,
  selectedPrefectures,
  onPrefectureChange,
}) => (
  <div className={styles.prefectureSelector}>
    {prefectures.map((pref) => (
      <CheckboxWithLabel
        key={pref.prefCode}
        label={pref.prefName}
        checked={selectedPrefectures[pref.prefCode] || false}
        onChange={(checked) => onPrefectureChange(pref.prefCode, checked)}
      />
    ))}
  </div>
);

export default PrefectureSelector;