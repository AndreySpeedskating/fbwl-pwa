import { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { FreeMode, Mousewheel, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { withIonLifeCycle } from '@ionic/react';

import FeedCard from '../../components/FeedCard';
import { selectFeed, useFeedStore } from '../../store/slices/content.slice';
import { getFeedById, loadFeedComments } from '../../store/thunk/contentThunk';
import { IFeed } from '../../utils/api/interface';
import { FeedCommentModal, ZoomImageModal } from '../Main/components';
import styles from './styles.module.css';

type PropTypes = {
  isReader?: boolean;
};

const PostContent: FC<PropTypes> = ({ isReader }) => {
  const { id, sectionId } = useParams<{ id: string; sectionId?: string }>();
  const { post, _hasHydrated } = useFeedStore((store) => ({
    post: selectFeed(store, id, sectionId),
    _hasHydrated: store._hasHydrated,
  }));
  const [showComment, setShowComment] = useState<string | null>(null);
  const [showZoomModal, setShowZoomModal] = useState<IFeed | null>(null);
  const [uploadedPost, setUploadedPost] = useState<IFeed>();

  useEffect(() => {
    if (id && _hasHydrated) {
      loadFeedComments({ id });
    }
    if (_hasHydrated && !post && id) {
      getFeedById({
        cbSuccess: (content) => {
          setUploadedPost(content);
        },
        id,
      });
    }
  }, [_hasHydrated, id, post]);

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
        style={{ padding: '0 20px' }}
      >
        <SwiperSlide key={`${id}-post-content`}>
          {(post || uploadedPost) && (
            <FeedCard
              isPost={true}
              onImageClick={onImageClick}
              getCommentId={showComments}
              feed={(post || uploadedPost) as IFeed}
            />
          )}
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
