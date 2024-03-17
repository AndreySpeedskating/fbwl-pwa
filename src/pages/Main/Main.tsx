/* eslint-disable react/no-multi-comp */
import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { shallow } from 'zustand/shallow';

import { IonLoading, IonSpinner } from '@ionic/react';

import FeedCard from '../../components/FeedCard';
import PageContainer from '../../components/PageContainer';
import { setMainStartIndex, useFeedStore } from '../../store/slices/content.slice';
import { STORAGE } from '../../store/slices/indexedDb';
import { MENU_ITEM_ALIAS, useTabStore } from '../../store/slices/tab.slice';
import { loadAllFavoritePosts } from '../../store/thunk/contentThunk';
import { getMySubscribeStatus } from '../../store/thunk/userThunk';
import { defaultPageSize } from '../../utils/api/content.api';
import { IFeed } from '../../utils/api/interface';
import { getDataFromLs, getObjectFromLs } from '../../utils/helpers';
import useLoadFeedsAndComments from '../../utils/hooks/useLoadFeedsAndComments';
import { FeedCommentModal, ZoomImageModal } from './components';
import { COMMENT_CHUNK_ID } from './contsnats';

export default function Main(): ReactElement {
  const { loadFeeds, loadDraftFeeds } = useLoadFeedsAndComments();
  const { totalElements, draftFeeds, _hasHydrated, mainStartIndex } = useFeedStore(
    (store) => store,
    shallow
  );
  const feeds = useFeedStore((store) => store.feeds, shallow);
  const { activeTab, setActiveTab, _hasHydrated: hasHydratedTab } = useTabStore();
  const grtat = getDataFromLs('-pt');
  const user = getObjectFromLs('-uio');
  const [sessionUpdated, setSessionUpdated] = useState(false);
  const [showComment, setShowComment] = useState<string | null>(null);
  const [selectZoomModal, setSelectZoomModal] = useState<IFeed | null>(null);
  const virtuoso = useRef<VirtuosoHandle>(null);
  const scrollPosition = useRef<number>(0);
  const loadedList = useRef<number[]>([]);

  if (Array.isArray(feeds)) {
    // eslint-disable-next-line promise/catch-or-return, promise/prefer-await-to-then
    STORAGE.removeItem('feed-storage').finally(() => {
      window.location.reload();
    });
  }

  const list = useMemo(
    () =>
      user?.role?.includes('ADMIN') && activeTab === 'Сериал'
        ? [...draftFeeds, ...feeds[MENU_ITEM_ALIAS[activeTab]]]
        : feeds[MENU_ITEM_ALIAS[activeTab]],
    [feeds, draftFeeds, activeTab]
  );

  useEffect(
    () => () => {
      setMainStartIndex(scrollPosition.current);
      loadedList.current = [];
    },
    []
  );

  useEffect(() => {
    const loadServiceData = async (): Promise<void> => {
      await loadAllFavoritePosts({});
      await getMySubscribeStatus({});
    };
    if (grtat && !sessionUpdated && _hasHydrated && hasHydratedTab) {
      if (user?.role?.includes('ADMIN')) {
        loadDraftFeeds();
      }
      loadFeeds({ menuItem: MENU_ITEM_ALIAS[activeTab], refresh: true });
      setSessionUpdated(true);
      loadServiceData();
    }
    window.addEventListener('message', (e) => {
      if (virtuoso.current && e.data === 'scroll-top') {
        virtuoso.current.scrollToIndex({
          index: 0,
          behavior: 'smooth',
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grtat, _hasHydrated, hasHydratedTab]);

  const onSliderImageClickHandler = useCallback((feed: IFeed): void => {
    setSelectZoomModal(feed);
  }, []);

  function onSliderModalClose(): void {
    setSelectZoomModal(null);
  }

  function onCommentModalClose(): void {
    setShowComment(null);
  }

  const onTabChange = useCallback((title: keyof typeof MENU_ITEM_ALIAS): void => {
    virtuoso.current?.scrollToIndex({
      index: 0,
      behavior: 'smooth',
    });
    loadedList.current = [];
    if (title === 'Сериал') {
      setSessionUpdated(true);
      loadFeeds({ menuItem: MENU_ITEM_ALIAS[title], refresh: true });
      return;
    }
    setActiveTab(title);
    loadFeeds({ menuItem: MENU_ITEM_ALIAS[title], refresh: true });
  }, []);

  const getCommentId = useCallback((e: any): void => {
    const commentId = e.target.id?.replace(`${COMMENT_CHUNK_ID}-`, '');
    setShowComment(commentId);
  }, []);

  if (!_hasHydrated) {
    return <IonLoading isOpen={true} />;
  }

  return (
    <>
      <PageContainer onTabChange={onTabChange}>
        <Virtuoso
          id="virtuoso-container"
          data={list}
          ref={virtuoso}
          initialTopMostItemIndex={{ index: mainStartIndex + 1, align: 'end' }}
          rangeChanged={async (range) => {
            scrollPosition.current = range.startIndex;
            const page = range.endIndex / (defaultPageSize - 1);
            if (
              range.endIndex !== 0 &&
              range.endIndex % (defaultPageSize - 1) === 0 &&
              !loadedList.current.includes(page)
            ) {
              loadedList.current.push(page);
              await loadFeeds({
                page,
                menuItem: MENU_ITEM_ALIAS[activeTab],
                refresh: false,
              });
            }
          }}
          itemContent={(_, feed) =>
            !!feed ? (
              <FeedCard
                getCommentId={getCommentId}
                onImageClick={onSliderImageClickHandler}
                key={feed.id}
                isDraft={feed?.status === 'draft'}
                feed={feed}
              />
            ) : undefined
          }
          className={'list-corrector'}
          totalCount={
            user?.role?.includes('ADMIN') && activeTab === 'Сериал'
              ? totalElements + draftFeeds?.length
              : totalElements
          }
          overscan={300}
          components={{
            Footer: () =>
              feeds?.[MENU_ITEM_ALIAS[activeTab]]?.length < totalElements ? (
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <IonSpinner color="tertiary" />
                </div>
              ) : (
                <div style={{ height: 24 }} />
              ),
          }}
        ></Virtuoso>
      </PageContainer>
      <ZoomImageModal
        key={selectZoomModal?.id}
        isOpen={!!selectZoomModal}
        trigger={selectZoomModal?.id || undefined}
        data={selectZoomModal}
        onWillDismiss={onSliderModalClose}
      />
      <FeedCommentModal
        key={showComment}
        isOpen={!!showComment}
        trigger={showComment || undefined}
        id={showComment || ''}
        onWillDismiss={onCommentModalClose}
      />
    </>
  );
}
