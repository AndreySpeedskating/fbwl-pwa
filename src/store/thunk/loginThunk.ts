import { postAuthEmail, postAuthOtp, startAuth } from '../../utils/api/auth.api';
import { IFSToken } from '../../utils/api/interface';
import { getDataFromLs } from '../../utils/helpers';
import { setStartPoint } from '../slices/auth.slice';
import { setNotifyInfo } from '../slices/notify.slice';

const ERROR_MESSAGE: { [key: string]: string } = {
  invalid_otp: 'Неправильный код ОТП',
  otp_expired: 'Время действия ОТП кода истекло, нажмите "Отправить код повторно"',
};

export const getStartAuthToken = async (payload: { cbSuccess?: () => void }): Promise<void> => {
  try {
    const { cbSuccess } = payload;
    const { execution } = await startAuth();
    if (cbSuccess) {
      cbSuccess();
    }
    setStartPoint(execution);
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const postAuthOtpCode = async (payload: {
  otp: string;
  cbFail?: (data?: IFSToken) => void;
  cbSuccess?: (data?: IFSToken) => void;
}): Promise<void> => {
  try {
    const { otp, cbSuccess, cbFail } = payload;
    const execution = getDataFromLs('-pt');
    const response = await postAuthOtp({ otp, execution });
    const { form, id_token, view } = response;
    if (form?.errors) {
      const otpError: { message?: any } | undefined = form?.errors?.find(
        (formError) => formError?.field === 'otpCode'
      );
      const { message = '' } = otpError || {};
      cbFail && cbFail(response);
      !view?.isBlocked &&
        otpError &&
        setNotifyInfo({
          type: 'error',
          show: true,
          message: ERROR_MESSAGE?.[message] || 'Неверный ОТП код',
        });
      return;
    }
    if (id_token) {
      if (cbSuccess) {
        cbSuccess(response);
      }
      document.cookie = `_at=${id_token}`;
      setStartPoint(id_token);
    }
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const postAuthEmailCode = async (payload: {
  email: string;
  cbSuccess?: (data?: IFSToken) => void;
  eventId?: string;
}): Promise<void> => {
  try {
    const { email, cbSuccess, eventId } = payload;
    const execution = getDataFromLs('-pt');
    const response = await postAuthEmail({ email, execution, eventId });
    if (cbSuccess) {
      cbSuccess(response);
    }
    setStartPoint(response.execution);
  } catch (e: any) {
    throw new Error(e.message);
  }
};
