import style from './Text.module.scss'

type Props = {
    children: string
    isLink?: boolean
    fontSize?: "small" | "mediumSmall" | "medium" | "mediumLarge" | "large" | "extraLarge";
}

export default function Text({ children, isLink = false, fontSize = "medium" }: Props) {

    const fontSizeClass = {
        small: style.fontSizeSmall,
        mediumSmall: style.fontSizeMediumSmall,
        medium: style.fontSizeMedium,
        mediumLarge: style.fontSizeMediumLarge,
        large: style.fontSizeLarge,
        extraLarge: style.fontSizeExtraLarge,
    }[fontSize];

    return (
        <p className={`${style.mainText} ${isLink ? style.isLink : ''} ${fontSizeClass}`}>
            {children}
        </p>
    )
}
