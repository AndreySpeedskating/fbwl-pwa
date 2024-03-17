import { create } from 'zustand';

export interface INotifyState {
  message: string;
  show: boolean;
  type: 'error' | 'info' | 'success';
}

export const DEFAULT_NOTIFY_STATE: INotifyState = {
  message: '',
  type: 'info',
  show: false,
};

export const useNotify = create<
  INotifyState & {
    resetNotify: () => void;
    setNotifyInfo: (payload: INotifyState) => void;
  }
>((set) => ({
  message: '',
  type: 'info',
  show: false,
  setNotifyInfo: (payload: INotifyState) => set((state) => ({ ...state, ...payload })),
  resetNotify: () => set(() => ({ ...DEFAULT_NOTIFY_STATE })),
}));

export const { setNotifyInfo, resetNotify } = useNotify.getState();
