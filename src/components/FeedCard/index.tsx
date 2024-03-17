import { lockClosed } from 'ionicons/icons';
import { FC, useRef, useState } from 'react';

import { IonIcon, IonText } from '@ionic/react';

import { removePostReaction, setPostReaction } from '../../store/thunk/contentThunk';
import { IFeed } from '../../utils/api/interface';
import { DOUBLE_CLICK_THRESHOLD, ONE } from '../../utils/constants';
import { getObjectFromLs } from '../../utils/helpers';
import Slider from '../Slider';
import { Button } from '../UI';
import { Comment, HashTags, Status, Text } from './components';
import Author from './components/Author';
import styles from './styles.module.css';

type PropTypes = {
  feed: IFeed;
  getCommentId?: (e: any) => void;
  isDraft?: boolean;
  isPost?: boolean;
  isReader?: boolean;
  onImageClick?: (feed: IFeed) => void;
};

const FeedCard: FC<PropTypes> = ({
  feed,
  isDraft,
  onImageClick,
  getCommentId,
  isPost,
  isReader,
}) => {
  const user = getObjectFromLs('-uio');
  const [haveReaction, setHaveReaction] = useState(!!feed?.myReaction);
  const { id } = feed;
  const cout = useRef(0);

  const likeClickHandler = (): void => {
    setHaveReaction(!haveReaction);
    haveReaction
      ? removePostReaction({ id, menuItem: feed.menuItem, cbSuccess: () => setHaveReaction(false) })
      : setPostReaction({ id, menuItem: feed.menuItem, cbSuccess: () => setHaveReaction(true) });
  };

  const clickHandler = (): void => {
    cout.current = cout.current + ONE;
    const t = setTimeout(() => {
      if (cout.current === ONE) {
        onImageClick?.(feed);
      }
      if (cout.current > ONE) {
        likeClickHandler();
      }
      cout.current = 0;
      clearTimeout(t);
    }, DOUBLE_CLICK_THRESHOLD);
    if (cout.current > ONE) {
      clearTimeout(t);
    }
  };

  return (
    <div id={feed.id} className={`${styles.container} ${isDraft ? styles.draft : ''} flex-column`}>
      <Author
        menuItem={feed?.menuItem}
        isDraft={isDraft}
        title={feed?.title}
        id={feed?.id}
        sectionId={feed?.sectionId}
      />
      <Slider
        onImageClick={clickHandler}
        postId={feed.id}
        isFull
        postMedia={feed?.postMedia || []}
        isDraft={isDraft}
        key={feed?.id}
        isReader={isReader}
        menuItem={feed.menuItem}
      />
      <div
        id={feed?.lastPageElement ? `page-${feed?.lastPageElement}` : ''}
        className={styles.content}
      >
        <Status
          id={feed.id}
          title={feed?.title}
          likeCount={feed?.reactionsCount || 0}
          messageCount={feed?.commentCount || 0}
          getCommentId={getCommentId}
          likeClickHandler={likeClickHandler}
          myReaction={haveReaction}
          publishAt={isDraft ? feed?.publishAt : null}
          publishedAt={feed.publishedAt}
        />
        {feed?.hashtags && feed?.hashtags?.length > 0 && <HashTags hashtags={feed?.hashtags} />}
        <Text isDraft={isDraft} postId={feed.id} text={feed?.postText || ''} isPost={isPost} />
        <Comment getCommentId={getCommentId} comments={[]} id={feed.id} />
      </div>
      {user?.level === 'free' && feed?.level === 'paid' && (
        <>
          <div className={styles['banner']}></div>
          <div className={`${styles['info-block']} flex-column flex-align-center`}>
            <IonIcon icon={lockClosed} />
            <IonText className={styles['text']}>Платный контент</IonText>
            <Button style={{ width: '80%' }} href="#/subscribe">
              Купить подписку
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FeedCard;
