import { MenuItemType, setDraftFeeds, setMoreFeeds } from '../../store/slices/content.slice';
import { setFeedComments } from '../../store/slices/service.slice';
import { getDraftFeeds, getFeedComments, getFeeds } from '../api/content.api';
import { IFeedComment } from '../api/interface';

type loadFeedsProps = {
  isTile?: boolean;
  menuItem?: MenuItemType;
  page?: number;
  refresh?: boolean;
  size?: number;
  tag?: string | null;
};

const useLoadFeedsAndComments = (): {
  loadComments: (ids: string[]) => Promise<void>;
  loadDraftFeeds: () => Promise<void>;
  loadFeeds: ({ menuItem, page, size, tag, refresh }: loadFeedsProps) => Promise<void>;
} => {
  const loadComments = async (ids: string[]): Promise<void> => {
    const comments: { [key: string]: IFeedComment[] } = {};
    await Promise.allSettled(
      ids?.map(async (id: string): Promise<any> => {
        await getFeedComments(id).then((response) => {
          comments[id] = response;
          return response;
        });
      })
    )
      .then(() => {
        setFeedComments(comments);
        return true;
      })
      .catch(() => {
        console.log('error than loading post comments');
      });
  };

  const loadFeeds = async ({
    menuItem,
    page,
    size,
    tag,
    refresh,
    isTile,
  }: loadFeedsProps): Promise<void> => {
    await getFeeds({ menuItem, page, size, tag }).then((response) => {
      if (response) {
        const { content, totalElements, ids } = response;
        const lastElem = content?.pop();
        if (lastElem) {
          lastElem.lastPageElement = page || 1;
          content.push(lastElem);
        }
        setMoreFeeds({
          feeds: content,
          totalElements,
          refresh,
          menuItem,
          tag: tag ? 'tag' : undefined,
        });
        !isTile && loadComments(ids);
      }
      return response;
    });
  };

  const loadDraftFeeds = async (): Promise<void> => {
    await getDraftFeeds().then((draftFeeds) => {
      setDraftFeeds(draftFeeds);
      return draftFeeds;
    });
  };

  return { loadComments, loadFeeds, loadDraftFeeds };
};

export default useLoadFeedsAndComments;
