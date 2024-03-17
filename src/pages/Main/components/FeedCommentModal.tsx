import { FC, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router';

import { IonModal, IonText } from '@ionic/react';

import CommentsList from '../../../components/CommentsList';
import NavHeader from '../../../components/NavHeader';
import { selectFeed, useFeedStore } from '../../../store/slices/content.slice';
import { useServiceStore } from '../../../store/slices/service.slice';
import { IFeedComment } from '../../../utils/api/interface';
import styles from './styles.module.css';

type PropTypes = {
  id: string;
  isOpen: boolean;
  onWillDismiss(): void;
  trigger: string | undefined;
  isReader?: boolean;
};

const FeedCommentModal: FC<PropTypes> = ({ isOpen, trigger, onWillDismiss, id }) => {
  const location = useLocation();
  const { sectionId } = useParams<{ sectionId?: string }>();
  const pathName = useRef('');
  const commentModalRef = useRef<HTMLIonModalElement>(null);
  const comments: IFeedComment[] = useServiceStore((store) => store.comments?.[id]);
  const { postText = '', hashtags = [] } = useFeedStore((store) => {
    const feed = selectFeed(store, id, sectionId);
    return {
      postText: feed?.postText,
      hashtags: feed?.hashtags,
    };
  });

  useEffect(() => {
    if (!pathName.current) {
      pathName.current = location.pathname;
    }
    if (pathName.current && location.pathname !== pathName.current) {
      closeModalHandler();
    }
  }, [location.pathname]);

  const closeModalHandler = (): void => {
    if (commentModalRef?.current) {
      pathName.current = '';
      commentModalRef.current.dismiss();
    }
  };

  return (
    <IonModal
      ref={commentModalRef}
      isOpen={!!isOpen}
      trigger={trigger}
      handleBehavior="none"
      className="ion-custorm-backdrop-modal"
      onWillDismiss={onWillDismiss}
    >
      <NavHeader onClick={closeModalHandler}>
        <IonText className={styles['modal-title']}>Назад</IonText>
      </NavHeader>
      <CommentsList
        onHashTagClick={closeModalHandler}
        hashtags={hashtags}
        postText={postText}
        comments={comments}
        postId={id}
      />
    </IonModal>
  );
};

export default FeedCommentModal;
