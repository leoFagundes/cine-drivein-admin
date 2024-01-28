import style from './Text.module.scss'

type Props = {
  children: string
  isLink?: boolean
  fontSize?: "small" | "mediumSmall" | "medium" | "mediumLarge" | "large" | "extraLarge";
  fontWeight?: "regular" | "medium" | "semibold" | "bold";
}

export default function Text({ children, isLink = false, fontSize = "medium", fontWeight = "regular" }: Props) {

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

  return (
    <p className={`${style.mainText} ${isLink ? style.isLink : ''} ${fontSizeClass} ${fontWeightClass}`}>
      {children}
    </p>
  )
}
