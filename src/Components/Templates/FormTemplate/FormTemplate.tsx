import styles from "./FormTemplate.module.scss";
import LogoImage from "../../Atoms/LogoImage";
import Text from "../../Atoms/Text";
import { Input } from "../../Atoms/Input/Input";
import Button from "../../Atoms/Button";
import { ChangeEvent, ReactNode, useState } from "react";
import Caption from "../../Molecules/Caption";
import CheckBox from "../../Atoms/CheckBox";

type FormTemplateType = {
  label: string;
  inputs: Array<{
    value: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: "file" | "password" | "text" | "number";
    errorLabel: string;
    caption?: ReactNode;
  }>;
  buttonLabel: string;
  buttonOnClick: VoidFunction;
  linkLabel?: string;
  linkIcon?: React.ReactNode;
  linkOnClick?: VoidFunction;
  createAccountTokenInfo?: {
    value: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: "file" | "password" | "text" | "number";
    errorLabel: string;
    caption?: ReactNode;
  };
  logo?: boolean;
};

export const FormTemplate = ({
  label,
  inputs,
  buttonLabel,
  buttonOnClick,
  linkLabel,
  linkIcon,
  linkOnClick,
  createAccountTokenInfo,
  logo = true,
}: FormTemplateType) => {
  const [isChecked, setChecked] = useState(false);
  const getInputMargin = (index: number, errorLabel: string) => {
    if (index === 0) return "";
    if (errorLabel) return "12px";
    return "24px";
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buttonOnClick();
    }
  };
  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };

  return (
    <section className={styles.container}>
      {logo && <LogoImage marginBottom="40px" />}
      <Text marginBottom="32px" fontSize="extraLarge">
        {label}
      </Text>
      <div className={styles.inputs}>
        {inputs.map((item, index) => {
          return (
            <Input
              key={item.placeholder}
              value={item.value}
              placeholder={item.placeholder}
              onChange={item.onChange}
              type={item.type}
              errorLabel={item.errorLabel}
              marginTop={getInputMargin(index, item.errorLabel)}
              caption={item.caption}
              onKeyDown={handleKeyPress}
            />
          );
        })}
      </div>
      {createAccountTokenInfo && (
        <div className={styles.adminContent}>
          <div onClick={handleCheckboxChange}>
            <Caption
              marginTop="4px"
              label={"Dar permissões de admin para este usuário?"}
              isLink
              onClickCheckBox={handleCheckboxChange}
              checkboxRight={
                <CheckBox
                  id="admin-checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
              }
              fontSize="small"
            />
          </div>
          {isChecked && (
            <Input
              value={createAccountTokenInfo.value}
              onChange={createAccountTokenInfo.onChange}
              placeholder={createAccountTokenInfo.placeholder}
              errorLabel={createAccountTokenInfo.errorLabel}
              marginTop="8px"
              type={createAccountTokenInfo.type}
              onKeyDown={handleKeyPress}
            />
          )}
        </div>
      )}
      <Button label={buttonLabel} onClick={buttonOnClick} />
      <Caption
        marginTop="14px"
        onClick={linkOnClick}
        isLink
        iconLeft={linkIcon}
        label={linkLabel || ""}
      />
    </section>
  );
};
