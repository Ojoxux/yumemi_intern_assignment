import React from 'react';
import styles from './SelectBox.module.css';

interface SelectBoxProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

const SelectBox: React.FC<SelectBoxProps> = ({ options, value, onChange, id }) => {
  return (
    <div className={styles.selectWrapper}>
      <select
        id={id}
        className={styles.selectBox}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectBox;