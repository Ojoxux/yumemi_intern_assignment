import React from 'react';
import Checkbox from '../atoms/Checkbox';
import Label from '../atoms/Label';

interface CheckboxWithLabelProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = ({ label, checked, onChange }) => (
  <div className="checkbox-with-label">
    <Checkbox checked={checked} onChange={onChange} id={`checkbox-${label}`} />
    <Label htmlFor={`checkbox-${label}`}>{label}</Label>
  </div>
);

export default CheckboxWithLabel;