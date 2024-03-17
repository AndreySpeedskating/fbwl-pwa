import { IInitSubscribe } from '../../utils/api/interface';
import {
  disableAutoprolongation,
  enableAutoprolongation,
  getSubscribeInitData,
} from '../../utils/api/subscribe.api';

type SubScripePropTypes = {
  cbFail?: () => void;
  cbSuccess?: (data: IInitSubscribe) => void;
};

type ProlongationType = {
  cbFail?: () => void;
  cbSuccess?: () => void;
};

export const getInitialSubscribeData = async ({
  cbSuccess,
  cbFail,
}: SubScripePropTypes): Promise<void> => {
  try {
    const { data } = await getSubscribeInitData();
    cbSuccess?.(data);
  } catch (e: any) {
    if (cbFail) {
      cbFail();
    }
    throw new Error(e.message);
  }
};

export const setAutoprolongation = async ({
  cbSuccess,
  cbFail,
}: ProlongationType): Promise<void> => {
  try {
    await enableAutoprolongation();
    cbSuccess?.();
  } catch (e: any) {
    cbFail?.();
    throw new Error(e.message);
  }
};

export const removeAutoprolongation = async ({
  cbSuccess,
  cbFail,
}: ProlongationType): Promise<void> => {
  try {
    await disableAutoprolongation();
    cbSuccess?.();
  } catch (e: any) {
    cbFail?.();
    throw new Error(e.message);
  }
};
