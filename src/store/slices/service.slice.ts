import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { IFeed, IFeedComment, IHero } from '../../utils/api/interface';
import { deserializePersistedData, serializePersistedData } from '../../utils/helpers';
import { STORAGE } from './indexedDb';

export interface IServiceState {
  _hasHydrated: boolean;
  comments: {
    [key: string]: IFeedComment[];
  };
  favorite: string[];
  favoritePosts: IFeed[];
  heroes: IHero[];
  likedComments: string[];
}

interface IServiceActions {
  addToFavorites: (payload: string[]) => void;
  likeComments: (id: string) => void;
  setFavoritePosts: (action: IFeed[]) => void;
  setFeedComments: (payload: { [key: string]: IFeedComment[] }) => void;
  setHasHydrated: (flag: boolean) => void;
  setHeroes: (payload: IHero[]) => void;
  unLikeComments: (id: string) => void;
  updateStatefromCache: (state: IServiceState) => void;
}

export const useServiceStore = create<IServiceActions & IServiceState>()(
  persist(
    (set) => ({
      comments: {},
      favorite: [],
      favoritePosts: [],
      likedComments: [],
      heroes: [],
      _hasHydrated: false,
      setFeedComments: (payload: { [key: string]: IFeedComment[] }) =>
        set((state) => ({
          ...state,
          comments: { ...state.comments, ...payload },
        })),
      updateStatefromCache: (cachedState: IServiceState) => {
        set((state) => ({ ...state, ...cachedState }));
      },
      likeComments: (id: string) =>
        set((state) => ({
          ...state,
          likedComments: [...state.likedComments, id],
        })),
      unLikeComments: (id: string) =>
        set((state) => ({
          ...state,
          likedComments: state.likedComments.filter((comment) => comment !== id),
        })),
      setHeroes: (payload: IHero[]) =>
        set((state) => ({
          ...state,
          heroes: payload,
        })),
      setHasHydrated: (flag: boolean) => {
        set((state) => ({
          ...state,
          _hasHydrated: flag,
        }));
      },
      setFavoritePosts: (payload: IFeed[]) =>
        set((state) => ({
          ...state,
          favoritePosts: payload,
        })),
      addToFavorites: (payload: string[]) =>
        set((state) => ({
          ...state,
          favorite: payload,
        })),
    }),
    {
      name: 'service-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      storage: createJSONStorage(() => ({
        getItem: async (name: string) =>
          STORAGE.getItem<string | null>(name, (err, value) => {
            if (value) {
              const persistedState = deserializePersistedData<{ state: IServiceState }>(value);
              updateStatefromCache(persistedState.state);
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

export const {
  updateStatefromCache,
  setFavoritePosts,
  addToFavorites,
  setFeedComments,
  setHeroes,
  likeComments,
  unLikeComments,
} = useServiceStore.getState();
