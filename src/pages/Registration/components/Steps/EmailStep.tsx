import { FC } from 'react';

import InputWarning from '../../../../components/InputWarning';
import { FormInput } from '../components';

type PropTypes = {
  error: boolean;
  inputChnageHandler: (e: any) => void;
  value: string;
};

export const EmailStep: FC<PropTypes> = ({ inputChnageHandler, value, error }) => (
  <>
    <FormInput
      placeholder="Введите вашу почту"
      error={error}
      value={value}
      inputChnageHandler={inputChnageHandler}
      type="email"
    />
    {error && (
      <div className={'flex-row flex-space-between'}>
        <InputWarning message={'Некорректный email'} />
      </div>
    )}
  </>
);
