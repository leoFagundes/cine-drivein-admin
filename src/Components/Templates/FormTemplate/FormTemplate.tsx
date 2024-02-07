import styles from './FormTemplate.module.scss';
import LogoImage from "../../Atoms/LogoImage";
import Text from "../../Atoms/Text";
import { Input } from "../../Atoms/Input/Input";
import Button from "../../Atoms/Button";
import { ChangeEvent, ReactNode, useState } from 'react';
import Caption from '../../Molecules/Caption';
import CheckBox from '../../Atoms/CheckBox';

type FormTemplateType = {
  label: string,
  inputs: Array<{
    value: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    errorLabel: string;
    caption?: ReactNode;
  }>;
  buttonLabel: string;
  buttonOnClick: VoidFunction;
  linkLabel: string;
  linkIcon: React.ReactNode;
  linkOnClick: VoidFunction;
  createAccountTokenInfo?: {
    value: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    errorLabel: string;
    caption?: ReactNode;
  }
}

export const FormTemplate = ({ label, inputs, buttonLabel, buttonOnClick, linkLabel, linkIcon, linkOnClick, createAccountTokenInfo }: FormTemplateType) => {
  const [isChecked, setChecked] = useState(false);
  const getInputMargin = (index: number, errorLabel: string) => {
    if (index === 0) return ''
    if (errorLabel) return '12px'
    return '24px'
  }
  return (
    <section className={styles.container}>
      <LogoImage marginBottom="40px" />
      <Text marginBottom="32px" fontSize='extraLarge'>{label}</Text>
      <div className={styles.inputs}>
        {
          inputs.map((item, index) => {
            return <Input
              key={item.placeholder}
              value={item.value}
              placeholder={item.placeholder}
              onChange={item.onChange}
              type={item.type}
              errorLabel={item.errorLabel}
              marginTop={getInputMargin(index, item.errorLabel)}
              caption={item.caption}
            />
          })
        }
      </div>
      {createAccountTokenInfo && <div className={styles.adminContent}>
        <Caption
          marginTop="4px"
          onClick={() => setChecked(!isChecked)}
          label={'Dar permissões de admin para este usuário?'}
          checkboxRight={<CheckBox checked={isChecked} onChange={() => setChecked(!isChecked)} />}
          fontSize='small'
        />
        {isChecked &&
          <Input
            value={createAccountTokenInfo.value}
            onChange={createAccountTokenInfo.onChange}
            placeholder={createAccountTokenInfo.placeholder}
            errorLabel={createAccountTokenInfo.errorLabel}
            marginTop='8px'
            type={createAccountTokenInfo.type}
          />
        }
      </div>}
      <Button label={buttonLabel} onClick={buttonOnClick} />
      <Caption marginTop="14px" onClick={linkOnClick} isLink iconLeft={linkIcon} label={linkLabel} />
    </section>
  )
}