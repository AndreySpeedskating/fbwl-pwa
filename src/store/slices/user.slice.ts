import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { IMyInfo, ISubscribeStatus } from '../../utils/api/interface';
import {
  deserializePersistedData,
  saveDataToLs,
  serializePersistedData,
} from '../../utils/helpers';
import { STORAGE } from './indexedDb';

export type LastPostType = {
  id: string;
  sectionId: string;
};
export interface IUserState {
  lastReaderPost: LastPostType | null;
  subscribtion: ISubscribeStatus | null;
}

interface IUserActions {
  setLastPost: (post: LastPostType | null) => void;
  setSubscribtionStatus: (status: ISubscribeStatus | null) => void;
}

export const useUser = create<IUserActions & IUserState>()(
  persist(
    (set) => ({
      subscribtion: null,
      lastReaderPost: null,
      setLastPost: (post: LastPostType | null) =>
        set((state) => ({ ...state, lastReaderPost: post })),
      setSubscribtionStatus: (status: ISubscribeStatus | null) =>
        set((state) => ({ ...state, subscribtion: status })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => ({
        getItem: (name: string) =>
          STORAGE.getItem(name, (err, value) => {
            if (value) {
              const persistedStore: { state: IUserState } = deserializePersistedData<{
                state: IUserState;
              }>(value);
              setSubscribtionStatus(persistedStore.state.subscribtion);
              setLastPost(persistedStore.state.lastReaderPost);
              return persistedStore;
            }
            return null;
          }),
        setItem: (name: string, value: string) =>
          STORAGE.setItem(name, serializePersistedData(value)) as unknown as Promise<void>,
        removeItem: (name: string) => STORAGE.removeItem(name),
      })),
    }
  )
);

export const { setSubscribtionStatus, setLastPost } = useUser.getState();

export function setUserInfo(action: IMyInfo): void {
  saveDataToLs(JSON.stringify(action), '-uio');
  window.dispatchEvent(new Event('storage'));
}
