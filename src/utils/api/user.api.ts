import { getCookie, getDataFromLs } from '../helpers';
import { contentApi } from './config.api';
import { IMyInfo, IPublicUserInfo, IUserSettings } from './interface';

const getHeaders = (): { Authorization: string } => {
  const at = getCookie('_at') || getDataFromLs('-pt');
  return {
    Authorization: `Bearer ${at}`,
  };
};

export const addMyAvatar = async (userId: string, formData: FormData): Promise<any> => {
  try {
    return await contentApi.post(`/users/${userId}/photo`, formData, {
      headers: {
        ...getHeaders(),
        'content-type': 'multipart/form-data',
      },
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const deleteMyAvatar = async (userId: string): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.delete(`/users/${userId}/photo`, {
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const changeMySettings = async ({ settings }: { settings: IUserSettings }): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.put(
      '/users/@me/settings',
      { ...settings },
      {
        headers,
      }
    );
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const chengeMyPublicInfo = async (data: IPublicUserInfo): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.put(
      '/users/@me/public_info',
      { ...data },
      {
        headers,
      }
    );
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getMyInfo = async (): Promise<{ data: IMyInfo }> => {
  try {
    const headers = getHeaders();
    return await contentApi.get('/users/@me', {
      headers,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getUserInfo = async (id: string): Promise<{ data: IMyInfo }> => {
  try {
    const headers = getHeaders();
    return await contentApi.get(`/users/${id}`, {
      headers,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
