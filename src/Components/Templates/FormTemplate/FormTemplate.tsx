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
  isCreateAccount?: boolean
  createAccountInputs?: Array<{
    value: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    errorLabel: string;
    caption?: ReactNode;
  }>;
}

export const FormTemplate = ({ label, inputs, buttonLabel, buttonOnClick, linkLabel, linkIcon, linkOnClick, isCreateAccount, createAccountInputs }: FormTemplateType) => {
  const [isChecked, setChecked] = useState(false);

  const getInputMargin = (index: number, errorLabel: string) => {
    if (index === 0) return ''
    if (errorLabel) return '12px'
    return '24px'
  }
  return (
    <section className={styles.container}>
      <LogoImage />
      <Text fontSize='extraLarge'>{label}</Text>
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
      {isCreateAccount && <div className={styles.adminContent}>
        <Caption
          onClick={() => console.log('tese')}
          label={'Dar permissões de admin para este usuário?'}
          checkboxRight={<CheckBox onChange={() => setChecked(!isChecked)} />}
          fontSize='small'
        />
        {isChecked &&
          <>
            <div className={styles.inputs}>
              {
                createAccountInputs && createAccountInputs.map((item, index) => {
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
          </>
        }
      </div>}
      <Button label={buttonLabel} onClick={buttonOnClick} />
      <Caption onClick={linkOnClick} isLink iconLeft={linkIcon} label={linkLabel} />
    </section>
  )
}