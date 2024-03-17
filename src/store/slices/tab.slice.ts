import localforage from 'localforage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { deserializePersistedData, serializePersistedData } from '../../utils/helpers';

export const STORAGE = localforage.createInstance({
  driver: [localforage.INDEXEDDB],
  name: 'fbwl-tab',
  version: 1.0,
  storeName: 'fbwl-tab',
});

export enum ETabItems {
  SERIAL = 'serial',
  VIDEO = 'video',
  BACKSTAGE = 'backstage',
  HEROES = 'heroes',
}

export const MENU_ITEM_ALIAS: { [key: string]: ETabItems } = {
  Сериал: ETabItems.SERIAL,
  Видео: ETabItems.VIDEO,
  backstage: ETabItems.BACKSTAGE,
  Герои: ETabItems.HEROES,
} as const;

export const ACTIVE_MENU = {
  HEROES: 'Герои',
  SERIAL: 'Сериал',
  BACKSTAGE: 'backstage',
  VIDEO: 'Видео',
};

export type activeMenuKeys = keyof typeof ACTIVE_MENU;
export type activeMenuValues = typeof ACTIVE_MENU[activeMenuKeys];

export const CLASS_ALIAS: { [key: activeMenuValues]: string } = {
  Сериал: 'serials-scheme',
  backstage: 'backstage-scheme',
  Видео: 'video-scheme',
  Герои: '',
};

export const CURRENT_BG: { [key: activeMenuValues]: string } = {
  Герои: '#e9e9ff',
  Сериал: '#e5f6f1',
  backstage: '#fffdd6',
  Видео: '#ffe6fc',
};

export interface ITabState {
  _hasHydrated: boolean;
  activeTab: keyof typeof MENU_ITEM_ALIAS;
}

interface ITabActions {
  setActiveTab: (tab: keyof typeof MENU_ITEM_ALIAS) => void;
  setHasHydrated: (flag: boolean) => void;
}

export const useTabStore = create<ITabActions & ITabState>()(
  persist(
    (set) => ({
      activeTab: 'Сериал',
      _hasHydrated: false,
      setActiveTab: (tab: keyof typeof MENU_ITEM_ALIAS) => set(() => ({ activeTab: tab })),
      setHasHydrated: (flag: boolean) => {
        set((state) => ({
          ...state,
          _hasHydrated: flag,
        }));
      },
    }),
    {
      name: 'tab-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      storage: createJSONStorage(() => ({
        getItem: async (name: string) =>
          STORAGE.getItem<string | null>(name, (err, value) => {
            if (value) {
              const persistedState = deserializePersistedData<{ state: ITabState }>(value);
              setActiveTab(persistedState.state.activeTab);
              return value;
            }
            return null;
          }),
        setItem: (name: string, value: string) => {
          STORAGE.setItem(name, serializePersistedData(value)) as unknown as Promise<void>;
        },
        removeItem: (name: string) => STORAGE.removeItem(name),
      })),
    }
  )
);

export const { setActiveTab } = useTabStore.getState();
