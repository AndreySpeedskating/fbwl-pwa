import { authAPI } from './config.api';
import { IFSToken } from './interface';

const uidmHeader = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept: 'application/json',
};

const ssoPath = 'sso/oauth2/access_token';

const f_query =
  'client_id=pwa_m2m&client_secret=password&realm=%2Fcustomer&grant_type=urn%3Aroox%3Aparams%3Aoauth%3Agrant-type%3Am2m&response_type=token%20cookie&service=login-email-lite';

export const startAuth = async (): Promise<IFSToken> => {
  try {
    const res = await authAPI.post(ssoPath, f_query, {
      headers: uidmHeader,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const postAuthEmail = async ({
  execution,
  email,
  eventId,
}: {
  email: string;
  execution: string;
  eventId?: string;
}): Promise<IFSToken> => {
  try {
    const res = await authAPI.post(
      ssoPath,
      `client_id=pwa_m2m&client_secret=password&realm=%2Fcustomer&grant_type=urn%3Aroox%3Aparams%3Aoauth%3Agrant-type%3Am2m&response_type=token%20cookie&service=login-email-lite&_eventId=${
        eventId || 'next'
      }&execution=${execution}&email=${email}`,
      {
        headers: uidmHeader,
      }
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const postAuthOtp = async ({
  execution,
  otp,
}: {
  execution: string;
  otp: string;
}): Promise<IFSToken> => {
  try {
    const res = await authAPI.post(
      ssoPath,
      `client_id=pwa_m2m&client_secret=password&realm=%2Fcustomer&grant_type=urn%3Aroox%3Aparams%3Aoauth%3Agrant-type%3Am2m&response_type=token%20cookie&service=login-email-lite&_eventId=validate&execution=${execution}&otpCode=${otp}`,
      {
        headers: uidmHeader,
      }
    );
    return res.data;
  } catch (error: any) {
    if (error?.response?.data?.error === 'invalid_grant') {
      window.location.reload();
    }
    throw new Error(error);
  }
};
