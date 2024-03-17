import { getCookie, getDataFromLs } from '../helpers';
import { contentApi } from './config.api';
import { IFeed, IFeedComment, IHero, IPost, ISection, IWritePostMessage } from './interface';

export const getHeaders = (): { Authorization: string } => {
  const at = getCookie('_at') || getDataFromLs('-pt');
  return {
    Authorization: `Bearer ${at}`,
  };
};

export const defaultPageSize = 21;

export const getFeeds = async ({
  page = 0,
  size = defaultPageSize,
  tag,
  menuItem,
}: {
  menuItem?: string | null;
  page?: number;
  size?: number;
  tag?: string | null;
}): Promise<{ content: IFeed[]; ids: string[]; totalElements: number } | void> => {
  try {
    const headers = getHeaders();
    const queryObj = (): string => {
      switch (true) {
        case !!tag:
          return `by-tag/${tag}`;
        case !!menuItem:
          return `by-menu-item/${menuItem}`;
        default:
          return 'all';
      }
    };
    const res: { data: { content: IFeed[]; totalElements: number } } = await contentApi.get(
      `/feed/${queryObj()}?page=${page}&size=${size}`,
      {
        headers,
      }
    );
    if (navigator.onLine && res?.data) {
      const { content, totalElements } = res.data;
      const ids = content?.map((feed: any) => feed.id);
      return { content, totalElements, ids };
    }
    if (!navigator.onLine) {
      throw new Error('network error');
    }
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getOneFeed = async (id: string): Promise<any> => {
  try {
    const headers = getHeaders();
    const res: { data: IFeed } = await contentApi.get(`/posts/${id}`, {
      headers,
    });

    return res?.data;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getFeedComments = async (id: string): Promise<any> => {
  try {
    const headers = getHeaders();
    const { data }: { data: IFeedComment[] } = await contentApi.get(`/posts/${id}/comments`, {
      headers,
    });
    return data;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const writeFeedComments = async (id: string, data: IWritePostMessage): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.post(`/posts/${id}/comments`, data, {
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const addFeedReaction = async (id: string): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.post(`/posts/${id}/reactions/like`, null, {
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const deleteFeedReaction = async (id: string): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.delete(`/posts/${id}/reactions/like`, {
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const addReactionComment = async (postId: string, commentsId: string): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.post(`/posts/${postId}/comments/${commentsId}/reactions/like`, null, {
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const deleteReactionComment = async (postId: string, commentsId: string): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.delete(`/posts/${postId}/comments/${commentsId}/reactions/like`, {
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const addFavoriteFeed = async (postId: string): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.post(`/favourite_posts/${postId}`, null, {
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const deleteFavoriteFeed = async (postId: string): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.delete(`/favourite_posts/${postId}`, {
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getFavoriteFeeds = async (): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.get('/favourite_posts?size=500', {
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getHeroes = async (): Promise<{ data: IHero[] }> => {
  try {
    const headers = getHeaders();
    return await contentApi.get('/heroes', {
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getAllSections = async (): Promise<{ data: ISection[] }> => {
  try {
    const headers = getHeaders();
    return await contentApi.get('/sections', {
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getFeedBySection = async (sectionId: string): Promise<IFeed[]> => {
  try {
    const headers = getHeaders();
    const res: { data: { content: IFeed[] } } = await contentApi.get(
      `/feed/by-section/${sectionId}?page=0&size=30&sort`,
      {
        headers,
      }
    );

    return res?.data.content;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const createPost = async (postData: IPost): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.post('/posts', postData, {
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const addPostMedia = async (postId: string, formData: FormData): Promise<any> => {
  try {
    return await contentApi.post(`/media/posts/${postId}`, formData, {
      headers: {
        ...getHeaders(),
        'content-type': 'multipart/form-data',
      },
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const updatePost = async (postId: string, postData: IPost): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.put(`/posts/${postId}`, postData, {
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getDraftFeeds = async (): Promise<IFeed[]> => {
  try {
    const headers = getHeaders();
    const res = await contentApi.get('posts/draftsAndWaitingForPublication?size=500', { headers });
    return res?.data.content;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const deletePost = async (feedId: string): Promise<any> => {
  try {
    const headers = getHeaders();
    return await contentApi.delete(`posts/${feedId}`, { headers });
  } catch (error: any) {
    throw new Error(error?.message);
  }
};
