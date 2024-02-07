import { ReactNode } from 'react'
import Text from '../../Atoms/Text'
import style from './Caption.module.scss'

type CaptionType = {
  iconLeft?: ReactNode;
  checkboxRight?: ReactNode;
  label: string;
  isLink?: boolean;
  onClick?: VoidFunction;
  fontSize?: "small" | "mediumSmall" | "medium" | "mediumLarge" | "large" | "extraLarge";
  marginTop?: string;
  marginBottom?: string;
}

export default function Caption({
    iconLeft,
    label,
    isLink = false,
    onClick,
    checkboxRight,
    fontSize,
    marginBottom,
    marginTop
  }: CaptionType) {
  return (
    <div style={{marginTop, marginBottom}} className={style.captionContainer} onClick={onClick && onClick}>
      {iconLeft}
      <Text fontSize={fontSize} isLink={isLink}>{label}</Text>
      {checkboxRight}
    </div>
  )
}
