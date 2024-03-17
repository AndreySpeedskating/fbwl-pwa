import { FC, memo } from 'react';

import { IonButton, IonText } from '@ionic/react';

import defaultAvatar from '../../../assets/image/default.png';
import { COMMENT_CHUNK_ID } from '../../../pages/Main/contsnats';
import { useServiceStore } from '../../../store/slices/service.slice';
import { IFeedComment } from '../../../utils/api/interface';
import { getObjectFromLs } from '../../../utils/helpers';
import styles from './styles.module.css';

type PropTypes = {
  comments: any[];
  id: string;
  getCommentId?: (e: any) => void;
};

const ONE = 1;
const COMMENT_BUTTON_CLASS_NAME = 'comment-button';

const Comment: FC<PropTypes> = ({ id, getCommentId }) => {
  const comments: IFeedComment[] = useServiceStore((store) => store.comments?.[id]);
  const user = getObjectFromLs('-uio');

  const lastComments = comments?.length > 0 ? comments[comments?.length - ONE] : undefined;

  return (
    <div className={`${styles['comment-block']} flex-column`} id={`${COMMENT_CHUNK_ID}-${id}`}>
      {lastComments && (
        <IonButton
          onClick={getCommentId}
          id={`${COMMENT_CHUNK_ID}-${id}`}
          className={`${styles[COMMENT_BUTTON_CLASS_NAME]} font400 button-transparent`}
        >{`Посмотреть ${
          comments?.length === ONE ? 'комментарий' : `комментарии (${comments?.length})`
        }`}</IonButton>
      )}
      <div className={`${styles['comment-wrapper']} ${styles[COMMENT_BUTTON_CLASS_NAME]} flex-row`}>
        <img
          width={32}
          height={32}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
          id={`${COMMENT_CHUNK_ID}-${id}`}
          src={user?.profilePictureURL || defaultAvatar}
          alt="avatar"
        />
        <IonText
          onClick={getCommentId}
          id={`${COMMENT_CHUNK_ID}-${id}`}
          className={styles['comment-message-button']}
        >
          Комментировать
        </IonText>
      </div>
    </div>
  );
};

export default memo(Comment);
