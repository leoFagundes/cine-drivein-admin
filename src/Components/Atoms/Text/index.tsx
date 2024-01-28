import style from './Text.module.scss'
import {ReactNode} from "react";

type Props = {
  children: ReactNode
  isLink?: boolean
  fontSize?: "small" | "mediumSmall" | "medium" | "mediumLarge" | "large" | "extraLarge";
  fontWeight?: "regular" | "medium" | "semibold" | "bold";
  fontColor?: "primary-color" | "main-white" | "invalid-color" | "success-color" | "gray-color" | "placeholder-color" | "background-color" | "background-secondary-color"
  fontAlign?: 'center' | 'justify' | 'left' | 'right'
  marginTop?: string;
}

export default function Text({ children, isLink = false, fontSize = "medium", fontWeight = "regular", fontColor="main-white", marginTop, fontAlign = 'center' }: Props) {

  const fontSizeClass = {
    small: style.fontSizeSmall,
    mediumSmall: style.fontSizeMediumSmall,
    medium: style.fontSizeMedium,
    mediumLarge: style.fontSizeMediumLarge,
    large: style.fontSizeLarge,
    extraLarge: style.fontSizeExtraLarge,
  }[fontSize];

  const fontWeightClass = {
    regular: style.fontWeightRegular,
    medium: style.fontWeightMedium,
    semibold: style.fontWeightSemibold,
    bold: style.fontWeightBold
  }[fontWeight]

  const fontColorClass = {
    'primary-color': style.fontColorPrimaryColor,
    'main-white': style.fontColorMainWhite,
    'invalid-color': style.fontColorInvalidColor,
    'success-color': style.fontColorSuccessColor,
    'gray-color': style.fontColorGrayColor,
    'placeholder-color': style.fontColorPlaceholderColor,
    'background-color': style.fontColorBackgroundColor,
    'background-secondary-color': style.fontColorBackgroundSecondaryColor
  }[fontColor]

  const textAlignClass = {
    justify: style.textAlignJustify,
    center: style.textAlignCenter,
    left: style.textAlignLeft,
    right: style.textAlignRight
  }[fontAlign]

  return (
    <label
      style={{marginTop}}
      className={`${isLink ? style.isLink : ''}
            ${fontSizeClass}
            ${fontWeightClass} 
            ${fontColorClass} 
            ${textAlignClass}`}
    >
      {children}
    </label>
  )
}
