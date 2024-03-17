import { FC, useEffect, useRef, useState } from 'react';

import { IonNote } from '@ionic/react';

import InputWarning from '../../../../components/InputWarning';
import { postAuthEmailCode } from '../../../../store/thunk/loginThunk';
import { IFSToken } from '../../../../utils/api/interface';
import { ONE, TWO } from '../../../../utils/constants';
import { FormInput } from '../components';
import { FORM_TEXT, REFRESH_TIMER } from '../constants';
import styles from './styles.module.css';

type PropTypes = {
  blockedMessage: (data?: IFSToken) => void;
  currentStep: boolean;
  email: string;
  error: boolean;
  formIsBlocked: boolean;
  inputChnageHandler: (e: any) => void;
  setIsLoading: (value: boolean) => void;
  setOtpRefreshData: (data?: IFSToken) => void;
  value: string;
  setOtpError?: (value: boolean) => void;
};

export const OtpStep: FC<PropTypes> = ({
  blockedMessage,
  error,
  value,
  inputChnageHandler,
  formIsBlocked,
  email,
  setOtpRefreshData,
  setIsLoading,
  setOtpError,
}) => {
  const timerRef = useRef<any>(null);
  const [timer, setTimer] = useState<number>(REFRESH_TIMER);
  const [startTimer, setStartTimer] = useState(false);
  useEffect(() => {
    if (startTimer) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === ONE) {
            clearInterval(interval);
            setStartTimer(false);
          }
          return prev - ONE;
        });
      }, 1000);
      timerRef.current = interval;
    }
  }, [startTimer]);

  useEffect(() => {
    setStartTimer(true);
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  const retryOtpCode = (): void => {
    postAuthEmailCode({
      email,
      eventId: 'resent',
      cbSuccess: (data) => {
        setOtpRefreshData(data);
        setOtpError?.(false);
        setTimer(REFRESH_TIMER);
        setStartTimer(true);
        if (data?.view?.isBlocked) {
          blockedMessage(data);
          return;
        }
        setIsLoading(false);
      },
    });
  };

  return (
    <div>
      <FormInput
        error={error}
        type="number"
        pattern="\d*"
        placeholder="Введите код"
        value={value}
        inputChnageHandler={inputChnageHandler}
      />
      <IonNote
        onClick={retryOtpCode}
        className={`${styles['note']} ${
          (timer && startTimer) || formIsBlocked ? styles['disabled'] : ''
        } font400`}
        slot="helper"
      >
        {FORM_TEXT['REFRESH']} {!!timer ? `00:${timer?.toString().padStart(TWO, '0')}` : ''}
      </IonNote>
      {error && (
        <div className={'flex-row flex-space-between'}>
          <InputWarning message={'Код введен неверно'} />
        </div>
      )}
    </div>
  );
};
