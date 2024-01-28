import { ReactNode } from 'react'
import Text from '../../Atoms/Text'
import style from './Caption.module.scss'

type CaptionType = {
    icon: ReactNode;
    label: string;
    isLink?: boolean;
    onClick?: VoidFunction;
}

export default function Caption({ icon, label, isLink = false, onClick }: CaptionType) {
    return (
        <div className={style.captionContainer} onClick={onClick && onClick}>
            {icon}
            <Text isLink={isLink}>{label}</Text>
        </div>
    )
}
