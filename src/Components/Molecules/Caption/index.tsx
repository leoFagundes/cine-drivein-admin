import { ReactNode } from "react";
import Text from "../../Atoms/Text";
import style from "./Caption.module.scss";

type CaptionType = {
  iconLeft?: ReactNode;
  checkboxRight?: ReactNode;
  checkboxLeft?: ReactNode;
  label: string;
  isLink?: boolean;
  onClick?: VoidFunction;
  fontSize?:
    | "small"
    | "mediumSmall"
    | "medium"
    | "mediumLarge"
    | "large"
    | "extraLarge";
  marginTop?: string;
  marginBottom?: string;
  onClickCheckBox?: VoidFunction;
};

export default function Caption({
  iconLeft,
  label,
  isLink = false,
  onClick,
  checkboxRight,
  checkboxLeft,
  fontSize,
  marginBottom,
  marginTop,
  onClickCheckBox,
}: CaptionType) {
  return (
    <div
      style={{ marginTop, marginBottom }}
      className={style.captionContainer}
      onClick={onClick && onClick}
    >
      {iconLeft}
      {checkboxLeft && onClickCheckBox !== undefined ? (
        <div className={style.checkBoxContainer}>
          <div
            className={style.checkBoxAuxClick}
            onClick={onClickCheckBox}
          ></div>
          {checkboxLeft}
        </div>
      ) : (
        <>{checkboxLeft}</>
      )}
      <Text fontSize={fontSize} isLink={isLink}>
        {label}
      </Text>
      {checkboxRight && onClickCheckBox !== undefined ? (
        <div className={style.checkBoxContainer}>
          <div
            className={style.checkBoxAuxClick}
            onClick={onClickCheckBox}
          ></div>
          {checkboxRight}
        </div>
      ) : (
        <>{checkboxRight}</>
      )}
    </div>
  );
}
