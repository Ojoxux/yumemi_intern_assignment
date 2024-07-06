import React from 'react';
import CheckboxWithLabel from '../molecules/CheckboxWithLabel';
import styles from './PrefectureSelector.module.css';

interface PrefectureSelectorProps {
  prefectures: { prefCode: number; prefName: string }[];
  selectedPrefectures: { [key: number]: boolean };
  onPrefectureChange: (prefCode: number, checked: boolean) => void;
  onClearAll: () => void;
}

const PrefectureSelector: React.FC<PrefectureSelectorProps> = ({
  prefectures,
  selectedPrefectures,
  onPrefectureChange,
  onClearAll,
}) => (
  <div className={styles.prefectureSelector}>
    <button onClick={onClearAll} className={styles.clearAllButton}>全て外す</button>
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