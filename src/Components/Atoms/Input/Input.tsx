import styles from './Input.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { ChangeEvent, useState } from "react";

type InputType = {
    value: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    errorLabel?: string;
    type?: string;
}
export const Input = ({ value, placeholder, onChange, errorLabel, type }: InputType) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const handlePassword = () => {
        setIsPasswordVisible(!isPasswordVisible)
    }

    const IS_ERROR_INPUT_STYLE = errorLabel ? styles.inputContainer__isNegative : styles.inputContainer;
    const IS_PASSWORD_VISIBLE_ICON = isPasswordVisible ? faEye : faEyeSlash;
    const IS_PASSWORD_VISIBLE_TYPE = isPasswordVisible ? undefined : type;
    return (
        <div className={styles.container}>
            <input type={IS_PASSWORD_VISIBLE_TYPE} value={value} placeholder={placeholder} onChange={onChange} className={IS_ERROR_INPUT_STYLE} />
            {type === 'password' &&
                <div aria-label='icone de olho' onClick={handlePassword} className={styles.icon}>
                    <FontAwesomeIcon color='#4a4a4a' size='lg' icon={IS_PASSWORD_VISIBLE_ICON} />
                </div>
            }
            {errorLabel && <label className={styles.labelError}>{errorLabel}</label>}
        </div>
    )
}