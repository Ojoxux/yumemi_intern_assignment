import React from 'react';
import CheckboxWithLabel from '../molecules/CheckboxWithLabel';

interface Prefecture {
  prefCode: number;
  prefName: string;
}

interface PrefectureListProps {
  prefectures: Prefecture[];
  selectedPrefectures: { [key: number]: boolean };
  onPrefectureChange: (prefCode: number, checked: boolean) => void;
}

const PrefectureList: React.FC<PrefectureListProps> = ({
  prefectures,
  selectedPrefectures,
  onPrefectureChange,
}) => {
  return (
    <div className="prefecture-list">
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
};

export default PrefectureList;
