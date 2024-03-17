/* eslint-disable react/no-multi-comp */
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import { IonLoading, IonSpinner } from '@ionic/react';

import PageContainer from '../../components/PageContainer';
import { tileScheme } from '../../components/TileCard/constants';
import TileLayer from '../../components/TileLayer';
import { setTileStartIndex, useFeedStore } from '../../store/slices/content.slice';
import { MENU_ITEM_ALIAS, useTabStore } from '../../store/slices/tab.slice';
import { IFeed } from '../../utils/api/interface';
import { getDataFromLs, splitArraytoChunks } from '../../utils/helpers';
import useLoadFeedsAndComments from '../../utils/hooks/useLoadFeedsAndComments';

const LINE_COUNT = 3;

export default function Tile(): ReactElement {
  const { loadFeeds } = useLoadFeedsAndComments();
  const { feeds, totalElements, _hasHydrated, tileStartIndex } = useFeedStore();
  const grtat = getDataFromLs('-pt');
  const { activeTab, setActiveTab, _hasHydrated: hasHydratedTab } = useTabStore();
  const [sessionUpdated, setSessionUpdated] = useState(false);
  const virtuoso = useRef<VirtuosoHandle>(null);
  const scrollPosition = useRef<number>(0);
  const loadedList = useRef<number[]>([]);

  const {
    params: { tag: params },
  } = useRouteMatch() as any;

  useEffect(
    () => () => {
      setTileStartIndex(scrollPosition.current);
      loadedList.current = [];
    },
    []
  );

  useEffect(() => {
    if (params) {
      setActiveTab('Сериал');
      loadFeeds({ tag: decodeURIComponent(params), refresh: true, isTile: true });
      loadedList.current = [];
      virtuoso.current?.scrollToIndex({
        index: 0,
        behavior: 'smooth',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    if (grtat && !sessionUpdated && _hasHydrated && !params && hasHydratedTab) {
      loadFeeds({ menuItem: MENU_ITEM_ALIAS[activeTab], refresh: true, isTile: true });
      setSessionUpdated(true);
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
  }, [grtat, _hasHydrated, params, hasHydratedTab]);

  function onTabChange(title: keyof typeof MENU_ITEM_ALIAS): void {
    virtuoso.current?.scrollToIndex({
      index: 0,
      behavior: 'smooth',
    });
    loadedList.current = [];
    setActiveTab(title);
    loadFeeds({ menuItem: MENU_ITEM_ALIAS[title], refresh: true, isTile: true });
  }

  if (!_hasHydrated) {
    return <IonLoading isOpen={true} />;
  }

  return (
    <PageContainer onTabChange={onTabChange}>
      <Virtuoso
        id="virtuoso-container"
        data={splitArraytoChunks<IFeed>(
          feeds[params ? 'tag' : MENU_ITEM_ALIAS[activeTab]],
          LINE_COUNT
        )}
        key = {MENU_ITEM_ALIAS[activeTab]}
        ref={virtuoso}
        className={'list-corrector'}
        initialTopMostItemIndex={{ index: tileStartIndex, align: 'start' }}
        itemContent={(i, data) => (
          <TileLayer isBig={tileScheme(i)[i]} key={`${data?.[0]?.id}-row`} feeds={data} />
        )}
        rangeChanged={async (range) => {
          scrollPosition.current = range.startIndex;
          const page = range.endIndex / 6;
          if (
            range.endIndex !== 0 &&
            range.endIndex % 6 === 0 &&
            !loadedList.current.includes(page)
          ) {
            loadedList.current.push(page);
            await loadFeeds({
              page,
              tag: params,
              menuItem: MENU_ITEM_ALIAS[activeTab],
              refresh: false,
              isTile: true,
            });
          }
        }}
        overscan={MENU_ITEM_ALIAS[activeTab] === 'heroes' ? 8000 : 300}
        components={{
          Footer: () =>
            feeds?.[params ? 'tag' : MENU_ITEM_ALIAS[activeTab]]?.length < totalElements ? (
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
              <div />
            ),
        }}
      ></Virtuoso>
    </PageContainer>
  );
}
