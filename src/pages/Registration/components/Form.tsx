import { arrowBackOutline } from 'ionicons/icons';
import { ReactElement, useState } from 'react';

import { IonButton, IonIcon, IonLoading, IonText } from '@ionic/react';

import { setRegistrationStatus } from '../../../store/slices/auth.slice';
import { useNotify } from '../../../store/slices/notify.slice';
import {
  getStartAuthToken,
  postAuthEmailCode,
  postAuthOtpCode,
} from '../../../store/thunk/loginThunk';
import { getMyInformation } from '../../../store/thunk/userThunk';
import { IFSToken } from '../../../utils/api/interface';
import { FIVEH } from '../../../utils/constants';
import { useDebounceCallback, useServiceHook } from '../../../utils/hooks';
import { EmailStep, OtpStep } from './Steps';
import { FeedBackModal } from './components';
import { DESCRIPTION, ESteps, FORM_TEXT, validEmailShcema } from './constants';
import { getMinutes, returnNumericValue } from './helpers';
import styles from './styles.module.css';

const Form = ({ historyUrl }: { historyUrl?: string }): ReactElement => {
  const { history } = useServiceHook();
  const delayNav = useDebounceCallback(FIVEH);
  const { setNotifyInfo } = useNotify();
  const [step, setStep] = useState<keyof typeof ESteps>(ESteps.EMAIL);
  const [otp, setOtp] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [isFeedBackFormOpen, setIsFeedBackFormOpen] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [otpRefreshData, setOtpRefreshData] = useState<IFSToken | undefined>(undefined);
  const isEmailStep = step === ESteps.EMAIL;
  const isOtpStep = step === ESteps.OTP;

  const buttonDisable = (isEmailStep && !email?.includes('@')) || isloading || (isOtpStep && !otp);
  const blockForm = otpRefreshData?.view?.isBlocked;

  const showError = (message: string): void => {
    setNotifyInfo({
      type: 'error',
      message,
      show: true,
    });
  };

  const emailInputChnageHandler = (e: any): void => {
    const {
      target: { value },
    } = e;
    setEmail(value);
    setEmailError(false);
  };

  const otpInputChangeHandler = (e: any): void => {
    const {
      target: { value },
    } = e;
    setOtp(returnNumericValue(value));
    setOtpError(false);
  };

  const feedbackForm = (): void => {
    setIsFeedBackFormOpen((prev) => !prev);
  };

  const goBack = (): void => {
    setStep(ESteps.EMAIL);
    setOtp('');
    setOtpRefreshData(undefined);
  };

  const blockedMessage = (data?: IFSToken): void => {
    if (data?.view?.isBlocked) {
      showError(
        `Вы исчерпили доступное количество попыток ввода ОТП кода. Форма обновится через ${getMinutes(
          data?.view?.blockedFor
        )}`
      );
      setTimeout(() => {
        window.location.reload();
      }, (data?.view?.blockedFor || 0) * 1000);
    }
  };

  const enterHandler = (): void => {
    getMyInformation({
      cbSuccess: (data) => {
        if (data?.id) {
          setRegistrationStatus('true');
          delayNav(() => {
            history.push(historyUrl ? historyUrl : '/main');
          });
          return;
        }
        if (!data?.id) {
          showError('Обновите страницу и попробуйте зайти заново');
        }
      },
    });
  };

  const getOtpCodeRequest = async (eventId?: string): Promise<void> => {
    await postAuthEmailCode({
      email,
      eventId,
      cbSuccess: (data) => {
        setOtpRefreshData(data);
        if (data?.view?.isBlocked) {
          blockedMessage(data);
          return;
        }
        setStep(ESteps.OTP);
        setIsLoading(false);
      },
    });
  };

  const getOtpCode = async (): Promise<void> => {
    setIsLoading(true);
    await getStartAuthToken({})
      .then(async () => {
        try {
          return await getOtpCodeRequest();
        } catch (e: any) {
          throw new Error(e.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const sendFormHandler = async (): Promise<void> => {
    if (isEmailStep) {
      const validEmail = validEmailShcema.exec(email);
      setEmailError(!validEmail);
      if (validEmail) {
        await getOtpCode();
      }
      return;
    }
    if (isOtpStep) {
      const payload = {
        otp,
        cbSuccess: () => {
          delayNav(enterHandler);
        },
        cbFail: (data?: IFSToken) => {
          setOtpError(true);
          setOtpRefreshData(data);
          if (data?.view?.isBlocked) {
            blockedMessage(data);
          }
        },
      };
      await postAuthOtpCode(payload);
    }
  };

  return (
    <>
      <div className={`${styles['container']} flex-column`}>
        <IonText>
          <span className={styles['text']}>{FORM_TEXT[step]['title']}</span>
          <br />
          <span className={`${styles['text']} font400`}>
            {DESCRIPTION(email)[step]['description']}
          </span>
        </IonText>
        <div>
          {isEmailStep && (
            <EmailStep
              error={emailError}
              value={email}
              inputChnageHandler={emailInputChnageHandler}
            />
          )}
          {isOtpStep && (
            <OtpStep
              error={otpError}
              value={otp}
              currentStep={isOtpStep}
              inputChnageHandler={otpInputChangeHandler}
              formIsBlocked={blockForm === true}
              email={email}
              setOtpRefreshData={setOtpRefreshData}
              setIsLoading={setIsLoading}
              blockedMessage={blockedMessage}
            />
          )}
        </div>
        <div className="flex-row flex-center full-width relative-p">
          {isOtpStep && (
            <IonIcon
              onClick={goBack}
              className={styles['back-icon']}
              icon={arrowBackOutline}
            ></IonIcon>
          )}
          <IonButton
            disabled={buttonDisable || blockForm}
            onClick={sendFormHandler}
            className={styles['send-button']}
          >
            {FORM_TEXT[step]['button']}
          </IonButton>
        </div>
      </div>
      <IonButton onClick={feedbackForm} className={`${styles['no-entry']} button-transparent`}>
        Не могу войти
      </IonButton>
      <FeedBackModal isOpen={isFeedBackFormOpen} onCancel={feedbackForm} />
      <IonLoading isOpen={isloading} />
    </>
  );
};

export default Form;
