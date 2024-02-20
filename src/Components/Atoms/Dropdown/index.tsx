import styles from './Dropdown.module.scss';
import { ChangeEvent, ReactNode } from "react";

type DropdownProps = {
  options: string[];
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  marginTop?: string;
  caption?: ReactNode;
}

export const Dropdown = ({ options, value, placeholder, onChange, marginTop, caption }: DropdownProps) => {
  return (
    <div style={{ marginTop }} className={styles.container}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={styles.select}>
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
      {caption && <label className={styles.caption}>{caption}</label>}
    </div>
  );
}