import { bookmark, bookmarkOutline, chatbubbleOutline, heart, heartOutline } from 'ionicons/icons';
import { FC, useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { FreeMode, Mousewheel, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { IonButton, IonIcon, withIonLifeCycle } from '@ionic/react';

import { HashTags } from '../../components/FeedCard/components';
import Author from '../../components/FeedCard/components/Author';
import Slider from '../../components/Slider';
import { HtmlContainer } from '../../components/UI';
import { selectFeed, useFeedStore } from '../../store/slices/content.slice';
import { useServiceStore } from '../../store/slices/service.slice';
import {
  loadAllFavoritePosts,
  removePostReaction,
  setPostReaction,
  setToFavoritePosts,
  unsetFavouritePosts,
} from '../../store/thunk/contentThunk';
import { IFeed } from '../../utils/api/interface';
import { DOUBLE_CLICK_THRESHOLD, ONE } from '../../utils/constants';
import { declWord } from '../../utils/helpers';
import { FeedCommentModal, ZoomImageModal } from '../Main/components';
import styles from './styles.module.css';

type PropTypes = {
  isReader?: boolean;
};

const buttonClass = 'icon-button';

const PostContent: FC<PropTypes> = ({ isReader }) => {
  const { id, sectionId } = useParams<{ id: string; sectionId?: string }>();
  const { post } = useFeedStore((store) => ({
    post: selectFeed(store, id, sectionId),
    _hasHydrated: store._hasHydrated,
  }));
  const favorite = useServiceStore((store) => store.favorite);
  const { commentCount = 0, myReaction, postMedia = [], postText = '' } = post || {};
  const [haveReaction, setHaveReaction] = useState(!!myReaction);
  const [showComment, setShowComment] = useState<string | null>(null);
  const [showZoomModal, setShowZoomModal] = useState<IFeed | null>(null);
  const cout = useRef(0);
  const contentRef = useRef<any>(null);

  const likeClickHandler = (): void => {
    setHaveReaction(!haveReaction);
    haveReaction
      ? removePostReaction({
          id,
          menuItem: post?.menuItem || 'serial',
          cbSuccess: () => setHaveReaction(false),
        })
      : setPostReaction({
          id,
          menuItem: post?.menuItem || 'serial',
          cbSuccess: () => setHaveReaction(true),
        });
  };

  const onCommentModalClose = (): void => {
    setShowComment(null);
  };

  const showComments = (): void => {
    setShowComment(id);
  };

  const onImageClick = useCallback(() => {
    if (post) {
      setShowZoomModal(post);
    }
  }, [post]);

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

  const clickHandler = (): void => {
    cout.current = cout.current + ONE;
    const t = setTimeout(() => {
      if (cout.current === ONE) {
        onImageClick();
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
    <>
      <Swiper
        direction={'vertical'}
        slidesPerView={'auto'}
        freeMode={true}
        scrollbar={true}
        mousewheel={true}
        observer
        observeParents
        observeSlideChildren
        modules={[FreeMode, Scrollbar, Mousewheel]}
        className={styles['home-swiper']}
      >
        <SwiperSlide key={`${id}-post-content`}>
          <div ref={contentRef} className={styles['content']}>
            <Author
              menuItem={post?.menuItem}
              title={post?.title}
              id={post?.id}
              sectionId={sectionId}
            />
          </div>
          <div className={`${styles['slider-wrapper']}`}>
            <Slider
              isReader
              postId={post?.id}
              postMedia={postMedia}
              isFull
              onImageClick={clickHandler}
            />
          </div>
          <div className={`${styles['info']} flex-row flex-align-center`}>
            <IonButton
              className={`${styles[buttonClass]} flex-row button-transparent`}
              onClick={likeClickHandler}
            >
              <IonIcon
                color={haveReaction ? 'danger' : 'dark'}
                icon={haveReaction ? heart : heartOutline}
              />
            </IonButton>
            <IonButton
              onClick={showComments}
              className={`${styles[buttonClass]} flex-row button-transparent`}
            >
              <IonIcon
                style={{ margin: 'auto 8px auto auto' }}
                color="dark"
                icon={chatbubbleOutline}
              />
              {commentCount > 0
                ? `${commentCount} ${declWord(commentCount, [
                    'комментарий',
                    'комментария',
                    'комментариев',
                  ])}`
                : ''}
            </IonButton>
            <IonButton
              style={{ margin: 'auto 0 auto auto' }}
              onClick={bookMarkClickHandler}
              className={`${styles[buttonClass]} flex-row button-transparent`}
            >
              <IonIcon
                className={styles.bookmark}
                icon={favorite?.includes(id) ? bookmark : bookmarkOutline}
              />
            </IonButton>
          </div>
          <div className={styles['content']}>
            <HashTags hashtags={post?.hashtags} />
            <HtmlContainer html={postText} />
          </div>
        </SwiperSlide>
      </Swiper>

      <FeedCommentModal
        isOpen={!!showComment}
        trigger={showComment || undefined}
        id={id || ''}
        onWillDismiss={onCommentModalClose}
        isReader={isReader}
      />
      <ZoomImageModal
        onWillDismiss={() => setShowZoomModal(null)}
        isOpen={!!showZoomModal}
        data={showZoomModal}
      />
    </>
  );
};

export default withIonLifeCycle(PostContent);
