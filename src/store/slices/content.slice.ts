import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { IFeed, ISection } from '../../utils/api/interface';
import { deserializePersistedData, serializePersistedData } from '../../utils/helpers';
import { STORAGE } from './indexedDb';

const ONE = 1;

export interface IFeedStore {
  _hasHydrated: boolean;
  draftFeeds: IFeed[];
  feedBySections: {
    [key: string]: {
      feed: IFeed[];
      isLoading: boolean;
    };
  };
  feeds: FeedStateType;
  mainStartIndex: number;
  sections: ISection[];
  tileStartIndex: number;
  totalElements: number;
}

export type FeedStateType = {
  backstage: IFeed[] | [];
  heroes: IFeed[] | [];
  serial: IFeed[] | [];
  tag: IFeed[] | [];
  video: IFeed[] | [];
};

export type MenuItemType = 'backstage' | 'heroes' | 'serial' | 'video';

export interface FeedsActionPayload {
  feeds: IFeed[];
  totalElements: number;
  menuItem?: MenuItemType;
  refresh?: boolean;
  tag?: string;
}

export interface IFeedActions {
  removeFeed: (id: string, menuItem: MenuItemType) => void;
  setDraftFeeds: (feeds: IFeed[]) => void;
  setFeedBySection: ({ feed, sectionId }: { feed: IFeed[]; sectionId: string }) => void;
  setFeedReaction: ({
    id,
    type,
    menuItem,
  }: {
    id: string;
    menuItem: MenuItemType;
    type: 'remove' | 'set';
  }) => void;
  setHasHydrated: (flag: boolean) => void;
  setLoadingFeedBySection: (sectionId: string, status: boolean) => void;
  setMainStartIndex: (index: number) => void;
  setMoreFeeds: ({ feeds, totalElements, refresh }: FeedsActionPayload) => void;
  setSections: (sections: ISection[]) => void;
  setTileStartIndex: (index: number) => void;
  updateEditedFeed: (feed: IFeed) => void;
  updateStatefromCache: (state: IFeedStore) => void;
}

export const useFeedStore = create<IFeedActions & IFeedStore>()(
  persist(
    (set) => ({
      draftFeeds: [],
      feeds: {
        backstage: [],
        heroes: [],
        serial: [],
        tag: [],
        video: [],
      },
      sections: [],
      feedBySections: {},
      totalElements: 0,
      mainStartIndex: 0,
      tileStartIndex: 0,
      _hasHydrated: false,
      setMoreFeeds: ({
        feeds,
        totalElements,
        refresh,
        menuItem = 'serial',
        tag,
      }: FeedsActionPayload) =>
        set((state) => {
          const key = tag ? 'tag' : menuItem;
          if (refresh) {
            return {
              ...state,
              feeds: { ...state.feeds, [key]: feeds },
              totalElements,
            };
          }
          const stateFeedsList = [...state.feeds[key]];
          feeds.forEach((f) => {
            const alreadyHave = stateFeedsList.findIndex((feed) => feed.id === f.id);
            if (alreadyHave !== -1) {
              stateFeedsList[alreadyHave] = f;
              return;
            }
            stateFeedsList.push(f);
          });
          return {
            ...state,
            feeds: { ...state.feeds, [key]: stateFeedsList },
            totalElements,
          };
        }),
      setDraftFeeds: (feeds: IFeed[]) =>
        set((state) => ({
          ...state,
          draftFeeds: feeds,
        })),
      updateEditedFeed: (updatedFeed: IFeed) =>
        set((state) => {
          const key = updatedFeed.menuItem;
          const newFeeds = state?.feeds[key].map((feed) =>
            feed.id === updatedFeed.id ? updatedFeed : feed
          );
          const section = state.feedBySections?.[updatedFeed?.sectionId || ''];
          const feedBySection: IFeed[] = section?.feed?.map((sectionFeed: IFeed) =>
            sectionFeed?.id === updatedFeed?.id ? updatedFeed : sectionFeed
          );

          return {
            ...state,
            feeds: { ...state.feeds, [key]: newFeeds },
            feedBySections: {
              ...state.feedBySections,
              [updatedFeed?.sectionId || '']: {
                feed: feedBySection,
                isLoading: false,
              },
            },
          };
        }),
      setSections: (sections: ISection[]): void => {
        set((state) => ({
          ...state,
          sections,
        }));
      },
      removeFeed: (id: string, menuItem: MenuItemType): void => {
        set((state) => ({
          ...state,
          feeds: {
            ...state.feeds,
            [menuItem]: state?.feeds[menuItem].filter((feed) => feed?.id !== id),
          },
        }));
      },
      setFeedBySection: ({ feed, sectionId }: { feed: IFeed[]; sectionId: string }) => {
        set((state) => ({
          ...state,
          feedBySections: { ...state.feedBySections, [sectionId]: { isLoading: false, feed } },
        }));
      },
      setLoadingFeedBySection: (sectionId, status) => {
        set((state) => ({
          ...state,
          feedBySections: {
            ...state.feedBySections,
            [sectionId]: { isLoading: status, feed: state.feedBySections?.[sectionId]?.feed },
          },
        }));
      },
      setFeedReaction: ({
        id,
        type,
        menuItem,
      }: {
        id: string;
        menuItem: MenuItemType;
        type: 'remove' | 'set';
      }) => {
        set((state) => {
          const newFeeds: IFeed[] = state.feeds[menuItem].map((feed) =>
            feed.id === id
              ? {
                  ...feed,
                  reactionsCount:
                    type === 'set'
                      ? (feed.reactionsCount || 0) + ONE
                      : (feed.reactionsCount || ONE) - ONE,
                }
              : { ...feed }
          );
          return {
            ...state,
            feeds: { ...state.feeds, [menuItem]: newFeeds },
          };
        });
      },
      updateStatefromCache: (cachedState: IFeedStore) => {
        set((state) => ({ ...state, ...cachedState }));
      },
      setHasHydrated: (flag: boolean) => {
        set((state) => ({
          ...state,
          _hasHydrated: flag,
        }));
      },
      setTileStartIndex: (index: number) => {
        set((state) => ({ ...state, tileStartIndex: index }));
      },
      setMainStartIndex: (index: number) => {
        set((state) => ({ ...state, mainStartIndex: index }));
      },
    }),
    {
      name: 'feed-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      storage: createJSONStorage(() => ({
        getItem: async (name: string) =>
          STORAGE.getItem<string | null>(name, (err, value) => {
            if (value) {
              const persistedState = deserializePersistedData<{ state: IFeedStore }>(value);
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
  setMoreFeeds,
  setDraftFeeds,
  updateEditedFeed,
  setSections,
  setFeedBySection,
  setFeedReaction,
  updateStatefromCache,
  setHasHydrated,
  removeFeed,
  setMainStartIndex,
  setTileStartIndex,
  setLoadingFeedBySection,
} = useFeedStore.getState();
export const selectFeed = (state: IFeedStore, id: string, sectionId?: string): IFeed | undefined =>
  sectionId
    ? state.feedBySections?.[sectionId]?.feed?.find((feed) => feed?.id === id)
    : Object.values(state.feeds)
        ?.flat(1)
        ?.find((feed) => feed?.id === id);
export const selectDraftFeed = (state: IFeedStore, id: string): IFeed | undefined =>
  state.draftFeeds?.find((feed) => feed.id === id);
