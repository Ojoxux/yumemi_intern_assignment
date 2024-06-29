import React, { useEffect, useState } from 'react';
import { fetchPrefectures } from '../services/api';

interface Prefecture {
  prefCode: number;
  prefName: string;
}

interface PrefectureListProps {
  onPrefectureChange: (prefCode: number, checked: boolean) => void;
}

const PrefectureList: React.FC<PrefectureListProps> = ({ onPrefectureChange }) => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);

  useEffect(() => {
    const loadPrefectures = async () => {
      try {
        const data = await fetchPrefectures();
        setPrefectures(data);
      } catch (error) {
        console.error('Failed to fetch prefectures:', error);
      }
    };
    loadPrefectures();
  }, []);

  return (
    <div className="prefecture-list">
      <h2>都道府県一覧</h2>
      {prefectures.map((pref) => (
        <label key={pref.prefCode} className="prefecture-item">
          <input
            type="checkbox"
            onChange={(e) => onPrefectureChange(pref.prefCode, e.target.checked)}
          />
          {pref.prefName}
        </label>
      ))}
    </div>
  );
};

export default PrefectureList;
