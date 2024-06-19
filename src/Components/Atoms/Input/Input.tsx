import styles from "./Input.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEyeSlash,
  faEye,
  faXmark,
  faPanorama,
} from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, ReactNode, useState, useRef, useEffect } from "react";
import Text from "../Text";

type InputType = {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errorLabel?: string;
  type?: "file" | "password" | "text" | "number";
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
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [imageName, setImageName] = useState<string>("Escolha uma imagem");
  const [isPlaceholderUp, setIsPlaceholderUp] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    if (isSuggestionOpen === true) {
      if (
        suggestions &&
        suggestions.filter((suggestion) => suggestion.includes(value))
          .length === 0
      ) {
        setIsSuggestionOpen(false);
      } else {
        setIsSuggestionOpen(true);
      }
    }

    if (value) {
      setIsPlaceholderUp(true);
    }
  }, [value, suggestions, inputRef, isSuggestionOpen]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageName(file.name);
    }
    onChange(e);
  };

  const IS_ERROR_INPUT_STYLE = errorLabel
    ? styles.inputContainer__isNegative
    : styles.inputContainer;
  const IS_PASSWORD_VISIBLE_ICON = isPasswordVisible ? faEye : faEyeSlash;
  const IS_PASSWORD_VISIBLE_TYPE = isPasswordVisible ? undefined : type;

  if (type === "file")
    return (
      <div style={{ marginTop }} className={styles.container}>
        <input
          id={"imageInput"}
          ref={inputRef}
          style={{ border: `2px solid ${border ? "gray" : "transparent"}` }}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={handleFileChange}
          className={styles.inputContainer__isImage}
          onKeyDown={onKeyDown}
        />
        {type === "file" && (
          <label htmlFor="imageInput" className={styles.customFileUpload}>
            <FontAwesomeIcon color="#1d2022" size="lg" icon={faPanorama} />
            <span>
              {imageName.length > 20
                ? `${imageName.slice(0, 20)}...`
                : imageName}
            </span>
          </label>
        )}
      </div>
    );

  return (
    <div style={{ marginTop }} className={styles.container}>
      {!errorLabel && (
        <div
          onClick={() => inputRef.current?.focus()}
          className={`${styles.placeHolderAux} ${
            isPlaceholderUp ? styles.up : styles.down
          }`}
        >
          <Text
            fontWeight="semibold"
            fontSize="mediumSmall"
            fontColor="placeholder-color"
          >
            {placeholder}
          </Text>
        </div>
      )}

      <input
        ref={inputRef}
        style={{ border: `2px solid ${border ? "gray" : "transparent"}` }}
        type={IS_PASSWORD_VISIBLE_TYPE}
        value={value}
        onFocus={() => {
          setIsSuggestionOpen(true);
          setIsPlaceholderUp(true);
        }}
        onBlur={() => (!value ? setIsPlaceholderUp(false) : {})}
        placeholder={errorLabel ? placeholder : ""}
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

      {isSuggestionOpen && suggestions && (
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
                    setIsSuggestionOpen(false);
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
              onClick={() => setIsSuggestionOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
