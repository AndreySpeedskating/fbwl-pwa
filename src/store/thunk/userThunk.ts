import {
  IMyInfo,
  IPublicUserInfo,
  ISubscribeStatus,
  IUserSettings,
} from '../../utils/api/interface';
import { getSubscribeStatus } from '../../utils/api/subscribe.api';
import {
  addMyAvatar,
  changeMySettings,
  chengeMyPublicInfo,
  deleteMyAvatar,
  getMyInfo,
  getUserInfo,
} from '../../utils/api/user.api';
import { setSubscribtionStatus, setUserInfo } from '../slices/user.slice';

type DefaultPayloadType = {
  cbFail?: () => void;
  cbSuccess?: (data?: any) => void;
};

type ChangeInfoType = {
  data: IPublicUserInfo;
};

export const changeMyInfo = async (payload: ChangeInfoType & DefaultPayloadType): Promise<void> => {
  const { data, cbSuccess, cbFail } = payload;
  await chengeMyPublicInfo(data)
    .then(() => {
      cbSuccess?.();
      return true;
    })
    .catch((e) => {
      cbFail?.();
      throw new Error(e.message);
    });
};

export const getMyInformation = async (payload: DefaultPayloadType): Promise<IMyInfo | void> => {
  const { cbSuccess, cbFail } = payload;
  try {
    const { data } = await getMyInfo();
    cbSuccess?.(data);
    setUserInfo(data);
    return data;
  } catch (e: any) {
    cbFail?.();
    throw new Error(e.message);
  }
};

export const deleteMyAvatarImage = async (
  payload: DefaultPayloadType & { id: string }
): Promise<void> => {
  const { id, cbSuccess, cbFail } = payload;
  await deleteMyAvatar(id)
    .then(() => {
      cbSuccess?.();
      return true;
    })
    .catch((e) => {
      cbFail?.();
      throw new Error(e.message);
    });
};

export const addMyAvatarImage = async (
  payload: DefaultPayloadType & { formData: FormData; id: string }
): Promise<void> => {
  const { id, formData, cbSuccess, cbFail } = payload;
  await addMyAvatar(id, formData)
    .then((response) => {
      cbSuccess?.();
      return response;
    })
    .catch((e) => {
      cbFail?.();
      throw new Error(e.message);
    });
};

export const getMySubscribeStatus = async (
  payload: DefaultPayloadType
): Promise<ISubscribeStatus | void> => {
  const { cbSuccess, cbFail } = payload;
  try {
    const { data } = await getSubscribeStatus();
    cbSuccess?.();
    setSubscribtionStatus(data);
    return data;
  } catch (e: any) {
    cbFail?.();
    setSubscribtionStatus(null);
    throw new Error(e.message);
  }
};

export const changeMyNotificationSettings = async (
  payload: DefaultPayloadType & { settings: IUserSettings }
): Promise<void> => {
  const { settings, cbSuccess, cbFail } = payload;
  try {
    const response = await changeMySettings({ settings });
    cbSuccess?.();
    return response;
  } catch (e: any) {
    cbFail?.();
    throw new Error(e.message);
  }
};

export const getUserIformation = async (payload: {
  id: string;
  cbFail?: () => void;
  cbSuccess?: (data: IMyInfo) => void;
}): Promise<IMyInfo | void> => {
  const { id, cbSuccess, cbFail } = payload;
  try {
    const { data } = await getUserInfo(id);
    cbSuccess?.(data);
    return data;
  } catch (e: any) {
    cbFail?.();
    throw new Error(e.message);
  }
};
