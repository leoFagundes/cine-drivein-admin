import { useState } from 'react'
import style from './CheckBox.module.scss'

type Props = {
    checked?: boolean
    onChange?: (isChecked: boolean) => void;
}

export default function CheckBox({ onChange, checked = false }: Props) {
    const [isChecked, setChecked] = useState(checked);

    const handleCheckboxChange = () => {
        const newCheckedState = !isChecked;
        setChecked(newCheckedState);
        onChange && onChange(newCheckedState);
    };

    return (
        <input
            className={`${style.checkBoxContainer}`}
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
        />
    )
}
