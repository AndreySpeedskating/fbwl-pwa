import {
  addFavoriteFeed,
  addFeedReaction,
  addReactionComment,
  deleteFavoriteFeed,
  deleteFeedReaction,
  deletePost,
  deleteReactionComment,
  getAllSections,
  getFavoriteFeeds,
  getFeedBySection,
  getFeedComments,
  getHeroes,
  getOneFeed,
  writeFeedComments,
} from '../../utils/api/content.api';
import { IFeed, ISection, IWritePostMessage } from '../../utils/api/interface';
import { ONE } from '../../utils/constants';
import {
  MenuItemType,
  setFeedBySection,
  setFeedReaction,
  setLoadingFeedBySection,
  setSections,
  updateEditedFeed,
} from '../slices/content.slice';
import {
  addToFavorites,
  likeComments,
  setFavoritePosts,
  setFeedComments,
  setHeroes,
  unLikeComments,
} from '../slices/service.slice';

export const getFeedById = async ({
  cbSuccess,
  id,
}: {
  id: string;
  cbSuccess?: (content: IFeed) => void;
}): Promise<void> => {
  await getOneFeed(id).then((feed) => {
    if (feed) {
      updateEditedFeed(feed);
      cbSuccess?.(feed);
    }
    return feed;
  });
};

export const setPostReaction = async ({
  id,
  cbSuccess,
  menuItem,
}: {
  id: string;
  menuItem: MenuItemType;
  cbSuccess?: () => void;
}): Promise<void> => {
  await addFeedReaction(id)
    .then(() => {
      setFeedReaction({ id, type: 'set', menuItem });
      cbSuccess?.();
      return true;
    })
    .catch(() => console.log('add reaction error'));
};

export const removePostReaction = async ({
  id,
  cbSuccess,
  menuItem,
}: {
  id: string;
  menuItem: MenuItemType;
  cbSuccess?: () => void;
}): Promise<void> => {
  await deleteFeedReaction(id)
    .then(() => {
      setFeedReaction({ id, type: 'remove', menuItem });
      cbSuccess?.();
      return true;
    })
    .catch(() => console.log('remove reaction error'));
};

export const setPostCommentReaction = async ({
  postId,
  commentId,
  cbSuccess,
}: {
  commentId: string;
  postId: string;
  cbSuccess?: () => void;
}): Promise<void> => {
  await addReactionComment(postId, commentId)
    .then(() => {
      likeComments(commentId);
      cbSuccess?.();
      return true;
    })
    .catch(() => console.log('like post error'));
};

export const removePostCommentReaction = async ({
  postId,
  commentId,
  cbSuccess,
}: {
  commentId: string;
  postId: string;
  cbSuccess?: () => void;
}): Promise<void> => {
  await deleteReactionComment(postId, commentId)
    .then(() => {
      unLikeComments(commentId);
      cbSuccess?.();
      return true;
    })
    .catch(() => console.log('unlike post error'));
};

export const setPostMessage = async ({
  data,
  id,
  cbSuccess,
}: {
  data: IWritePostMessage;
  id: string;
  cbSuccess?: () => void;
}): Promise<void> => {
  await writeFeedComments(id, data)
    .then(() => {
      cbSuccess?.();
      return true;
    })
    .catch(() => console.log('send post comments error'));
};

export const loadFeedComments = async ({
  id,
  cbSuccess,
}: {
  id: string;
  cbSuccess?: () => void;
}): Promise<void> => {
  await getFeedComments(id)
    .then((response) => {
      if (response) {
        setFeedComments({ [id]: response });
        cbSuccess?.();
      }
      return response;
    })
    .catch(() => console.log('error get feed comment'));
};

export const loadAllFavoritePosts = async ({
  cbSuccess,
}: {
  cbSuccess?: () => void;
}): Promise<void> => {
  await getFavoriteFeeds().then((response) => {
    if (response?.data?.content) {
      const list = response?.data?.content?.map(({ id = '' }) => id);
      setFavoritePosts(response?.data?.content);
      addToFavorites(list);
      cbSuccess?.();
    }
    return response;
  });
};

export const loadAllHeroes = async ({ cbSuccess }: { cbSuccess?: () => void }): Promise<void> => {
  await getHeroes().then((response) => {
    if (response?.data) {
      setHeroes(response.data);
      cbSuccess?.();
    }
    return true;
  });
};

export const loadAllSections = async ({
  cbSuccess,
}: {
  cbSuccess?: (data?: ISection[]) => void;
}): Promise<void> => {
  await getAllSections().then((response) => {
    if (response?.data) {
      const sortedData = response.data?.sort((a, b) => (a?.order < b?.order ? -ONE : ONE));
      cbSuccess?.(sortedData);
      setSections(sortedData);
    }
    return response;
  });
};

export const loadFeedListBySection = async (payload: {
  sectionId: string;
  cbSuccess?: (data?: IFeed[]) => void;
}): Promise<void> => {
  const { cbSuccess, sectionId } = payload;
  setLoadingFeedBySection(sectionId, true);
  try {
    const data = await getFeedBySection(sectionId);
    if (data) {
      cbSuccess?.(data);
      setFeedBySection({ sectionId, feed: data });
    }
  } catch (e: any) {
    setLoadingFeedBySection(sectionId, false);
    throw new Error(e.message);
  }
};

export const setToFavoritePosts = async ({
  id,
  cbSuccess,
}: {
  cbSuccess?: () => void;
  id?: string;
}): Promise<void> => {
  if (id) {
    await addFavoriteFeed(id).then((response) => {
      cbSuccess?.();
      return response;
    });
  }
};

export const unsetFavouritePosts = async ({
  id,
  cbSuccess,
}: {
  cbSuccess?: () => void;
  id?: string;
}): Promise<void> => {
  if (id) {
    await deleteFavoriteFeed(id).then((response) => {
      cbSuccess?.();
      return response;
    });
  }
};

export const deleteFeed = async (payload: {
  postId: string;
  cbFail?: () => void;
  cbSuccess?: () => void;
}): Promise<void> => {
  const { postId, cbSuccess, cbFail } = payload;
  await deletePost(postId)
    .then(() => {
      cbSuccess?.();
      return true;
    })
    .catch(() => {
      cbFail?.();
    });
};
