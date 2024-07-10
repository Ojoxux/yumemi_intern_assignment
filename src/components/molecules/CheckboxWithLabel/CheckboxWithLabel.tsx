import React from 'react';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import Label from '../../atoms/Label/Label';
import styles from './CheckboxWithLabel.module.css';

interface CheckboxWithLabelProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = ({ label, checked, onChange }) => (
  <div className={styles.checkboxWithLabel}>
    <Checkbox checked={checked} onChange={onChange} id={`checkbox-${label}`} />
    <Label htmlFor={`checkbox-${label}`}>{label}</Label>
  </div>
);

export default CheckboxWithLabel;
