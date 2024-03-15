import styles from "./Input.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, ReactNode, useState, useRef } from "react";

type InputType = {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errorLabel?: string;
  type?: string;
  marginTop?: string;
  caption?: ReactNode;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  border?: boolean;
  suggestions?: string[];
  onSelectSuggestion?: (value: string) => void;
};

export const Input = ({
  value,
  placeholder,
  onChange,
  errorLabel,
  type,
  marginTop,
  caption,
  onKeyDown,
  border = false,
  suggestions,
  onSelectSuggestion,
}: InputType) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSugeestionOpen, setIsSugeestionOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const IS_ERROR_INPUT_STYLE = errorLabel
    ? styles.inputContainer__isNegative
    : styles.inputContainer;
  const IS_PASSWORD_VISIBLE_ICON = isPasswordVisible ? faEye : faEyeSlash;
  const IS_PASSWORD_VISIBLE_TYPE = isPasswordVisible ? undefined : type;

  return (
    <div style={{ marginTop }} className={styles.container}>
      <input
        ref={inputRef}
        style={{ border: `2px solid ${border ? "gray" : "transparent"}` }}
        type={IS_PASSWORD_VISIBLE_TYPE}
        value={value}
        onFocus={() => setIsSugeestionOpen(true)}
        placeholder={placeholder}
        onChange={onChange}
        className={IS_ERROR_INPUT_STYLE}
        onKeyDown={onKeyDown}
      />
      {type === "password" && (
        <div
          aria-label="icone de olho"
          onClick={handlePassword}
          className={styles.icon}
        >
          <FontAwesomeIcon
            color="#4a4a4a"
            size="lg"
            icon={IS_PASSWORD_VISIBLE_ICON}
          />
        </div>
      )}
      {errorLabel && <label className={styles.labelError}>{errorLabel}</label>}
      {caption && <label className={styles.caption}>{caption}</label>}

      {isSugeestionOpen && suggestions && (
        <div className={styles.dropdownSuggestions}>
          <div className={styles.suggestionCard}>
            {suggestions
              .filter((suggestion) => suggestion.includes(value))
              .map((suggestion, index) => (
                <div
                  key={index}
                  className={`${
                    suggestion === value && styles.equalsValueSuggestion
                  } ${styles.suggestion}`}
                  onClick={() => {
                    onSelectSuggestion?.(suggestion);
                    setIsSugeestionOpen(false);
                  }}
                >
                  {suggestion}
                </div>
              ))}
          </div>
          <div className={styles.closeSuggestionIcon}>
            <FontAwesomeIcon
              color="#4a4a4a"
              size="sm"
              icon={faXmark}
              onClick={() => setIsSugeestionOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
