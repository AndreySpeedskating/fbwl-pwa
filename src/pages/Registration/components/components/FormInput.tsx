import { FC } from 'react';

import { IonInput } from '@ionic/react';

import { onKeyboardEnterPress } from '../../../../utils/helpers';
import styles from './styles.module.css';

type PropTypes = {
  error: boolean;
  inputChnageHandler: (e: any) => void;
  placeholder: string;
  type: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';
  value: string;
  pattern?: string;
};

export const FormInput: FC<PropTypes> = ({
  error,
  value,
  placeholder,
  pattern,
  type,
  inputChnageHandler,
}) => (
  <IonInput
    color={error ? 'danger' : ''}
    type={type}
    pattern={pattern}
    placeholder={placeholder}
    className={`${error ? styles['input-error'] : ''}`}
    value={value}
    clearInput={true}
    onIonChange={inputChnageHandler}
    onKeyDown={onKeyboardEnterPress}
    enterkeyhint="done"
  />
);
