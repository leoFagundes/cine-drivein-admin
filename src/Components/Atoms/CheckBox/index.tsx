import style from './CheckBox.module.scss'

type Props = {
  checked: boolean
  onChange: VoidFunction;
}

export default function CheckBox({ onChange, checked }: Props) {

  const handleCheckboxChange = () => {
    onChange && onChange();
  };

  return (
    <input
      className={`${style.checkBoxContainer}`}
      type="checkbox"
      checked={checked}
      onChange={handleCheckboxChange}
    />
  )
}
