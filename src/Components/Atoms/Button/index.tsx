import style from './Button.module.scss'

type Props = {
  onClick: () => void;
  label: string;
  marginTop?: string;
  marginBottom?: string;
  backGroundColor?: "primary-color" | "main-white" | "invalid-color" | "success-color" | "gray-color" | "placeholder-color" | "background-color" | "background-secondary-color"
};

export default function Button({ onClick, label, marginBottom, marginTop, backGroundColor = 'primary-color' }: Props) {
  const backGroundColorClass = {
    'primary-color': style.backgroundPrimaryColor,
    'main-white': style.backgroundMainWhite,
    'invalid-color': style.backgroundInvalidColor,
    'success-color': style.backgroundSuccessColor,
    'gray-color': style.backgroundGrayColor,
    'placeholder-color': style.backgroundPlaceholderColor,
    'background-color': style.backgroundBackgroundColor,
    'background-secondary-color': style.backgroundBackgroundSecondaryColor
  }[backGroundColor];

  const borderClass = {
    'primary-color': style.borderPrimaryColor,
    'main-white': style.borderMainWhite,
    'invalid-color': style.borderInvalidColor,
    'success-color': style.borderSuccessColor,
    'gray-color': style.borderGrayColor,
    'placeholder-color': style.borderPlaceholderColor,
    'background-color': style.borderBackgroundColor,
    'background-secondary-color': style.borderBackgroundSecondaryColor
  }[backGroundColor];

  return (
    <button style={{ marginTop, marginBottom }} className={`${style.button} ${backGroundColorClass} ${borderClass}`} onClick={onClick}>
      {label}
    </button>
  )
}
