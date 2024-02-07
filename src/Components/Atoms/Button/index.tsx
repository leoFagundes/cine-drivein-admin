import style from './Button.module.scss'

type Props = {
    onClick: () => void;
    label: string;
    marginTop?: string;
    marginBottom?: string;
};

export default function Button({ onClick, label, marginBottom, marginTop }: Props) {
    return (
        <button style={{marginTop, marginBottom}} className={style.button} onClick={onClick}>
            {label}
        </button>
    )
}
