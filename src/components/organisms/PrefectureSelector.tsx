import React from 'react';
import CheckboxWithLabel from '../molecules/CheckboxWithLabel';

interface PrefectureSelectorProps {
  prefectures: { prefCode: number; prefName: string }[];
  selectedPrefectures: { [key: number]: boolean };
  onPrefectureChange: (prefCode: number, checked: boolean) => void;
}

const PrefectureSelector: React.FC<PrefectureSelectorProps> = ({
  prefectures,
  selectedPrefectures,
  onPrefectureChange,
}) => (
  <div className="prefecture-selector">
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