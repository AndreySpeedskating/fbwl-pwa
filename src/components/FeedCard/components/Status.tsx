import {
  bookmark,
  bookmarkOutline,
  chatbubbleOutline,
  heart,
  heartOutline,
  paperPlaneOutline,
} from 'ionicons/icons';
import { FC, memo } from 'react';

import { IonIcon } from '@ionic/react';

import { useServiceStore } from '../../../store/slices/service.slice';
import {
  loadAllFavoritePosts,
  setToFavoritePosts,
  unsetFavouritePosts,
} from '../../../store/thunk/contentThunk';
import { full_width } from '../../../theme/variables';
import { timeAgo } from '../../../utils/helpers';
import styles from './styles.module.css';

type PropTypes = {
  id: string;
  likeClickHandler: () => void;
  likeCount: number;
  messageCount: number;
  myReaction: any;
  getCommentId?: (e: any) => void;
  publishAt?: string | null;
  publishedAt?: string;
  title?: string;
};

const Status: FC<PropTypes> = ({
  likeCount,
  id,
  myReaction,
  getCommentId,
  likeClickHandler,
  publishAt,
  publishedAt,
  title,
}) => {
  const favorite = useServiceStore((store) => store.favorite);
  const publishTime = publishedAt ? publishedAt : publishAt || null;

  const onFavoriteCbSuccess = (): void => {
    loadAllFavoritePosts({});
  };

  const bookMarkClickHandler = (): void => {
    if (favorite?.includes(id)) {
      unsetFavouritePosts({ id, cbSuccess: onFavoriteCbSuccess });
      return;
    }
    setToFavoritePosts({ id, cbSuccess: onFavoriteCbSuccess });
  };

  function shareHandler(): void {
    if (!!navigator?.canShare) {
      try {
        navigator.share({
          title: 'FBWL',
          text: title,
          url: `${window.location.href}`,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  }

  return (
    <div className={`${styles['status-container']} flex-column ${full_width}`}>
      <div className={`${styles['info-block']} flex-row`}>
        <IonIcon
          className={styles.wide}
          onClick={likeClickHandler}
          color={myReaction ? 'danger' : ''}
          icon={myReaction ? heart : heartOutline}
        />
        <IonIcon icon={chatbubbleOutline} onClick={getCommentId} id={`comments-${id}`} />
        <IonIcon className={styles['wide']} icon={paperPlaneOutline} onClick={shareHandler} />
        <IonIcon
          className={styles.bookmark}
          icon={favorite?.includes(id) ? bookmark : bookmarkOutline}
          onClick={bookMarkClickHandler}
        />
      </div>
      <div
        style={{ justifyContent: 'space-between' }}
        className={`${styles['info-block']} flex-row`}
      >
        {`Нравится ${likeCount}`}
        {
          <span className={`${styles['date']} font400`}>
            {publishTime ? timeAgo(publishTime) : ''}
          </span>
        }
      </div>
    </div>
  );
};

export default memo(Status);
