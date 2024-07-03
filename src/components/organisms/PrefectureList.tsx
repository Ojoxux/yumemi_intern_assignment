import React from 'react';

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
      <h2>都道府県一覧</h2>
      {prefectures.map((pref) => (
        <label key={pref.prefCode} className="prefecture-item">
          <input
            type="checkbox"
            checked={selectedPrefectures[pref.prefCode] || false}
            onChange={(e) => onPrefectureChange(pref.prefCode, e.target.checked)}
          />
          {pref.prefName}
        </label>
      ))}
    </div>
  );
};

export default PrefectureList;
