import style from './Button.module.scss'

type Props = {
    onClick: () => void;
    label: string;
};

export default function Button({ onClick, label }: Props) {
    return (
        <button className={style.button} onClick={onClick}>
            {label}
        </button>
    )
}
