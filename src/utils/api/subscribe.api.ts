import { getCookie, getDataFromLs } from '../helpers';
import { contentApi } from './config.api';
import { IInitSubscribe, ISubscribeStatus } from './interface';

const getHeaders = (): { Authorization: string } => {
  const at = getCookie('_at') || getDataFromLs('-pt');
  return {
    Authorization: `Bearer ${at}`,
  };
};

export const getSubscribeInitData = async (): Promise<{ data: IInitSubscribe }> => {
  try {
    const headers = getHeaders();
    return await contentApi.post('/payments/youmoney/initiate/embedded', null, {
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getSubscribeStatus = async (): Promise<{ data: ISubscribeStatus }> => {
  try {
    const headers = getHeaders();
    return await contentApi.get('subscriptions/active', {
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const enableAutoprolongation = async (): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.post('subscriptions/autoprolongation', null, {
      headers,
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const disableAutoprolongation = async (): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.delete('subscriptions/autoprolongation', {
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const registerPushSubscribtion = async (
  subscription: PushSubscriptionJSON
): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.post(
      'push/subscription',
      {
        endpoint: subscription?.endpoint,
        expirationTime: null,
        keys: {
          p256dh: subscription?.keys?.p256dh || '',
          auth: subscription?.keys?.auth || '',
        },
      },
      {
        headers,
      }
    );
  } catch (error: any) {
    throw new Error(error?.message);
  }
};
