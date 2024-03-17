import { heart, heartOutline } from 'ionicons/icons';

import { IonIcon, IonItem, IonText } from '@ionic/react';

import { full_width } from '../../theme/variables';
import AnswerBlock from './components/AnswerBlock';
import styles from './styles.module.css';

type PropTypes = {
  authorUsername: string;
  comments: PropTypes[];
  commentText: string;
  createdAt: string;
  id: string;
  parentId: string;
  postId: string;
  reactions: {
    angry: number;
    cry: number;
    laugh: number;
    like: number;
    love: number;
    sad: number;
    surprised: number;
  };
  selectedComment: string | null;
  authorID?: string;
  authorProfilePictureURL?: string;
  myReaction?: boolean;
  parentAuthorUserName?: string;
};

export function RenderComment({
  authorUsername,
  commentText,
  postId,
  parentId,
  comments,
  parentAuthorUserName,
  id,
  reactions,
  myReaction,
  authorProfilePictureURL,
  authorID,
  selectedComment,
}: PropTypes): any {
  return (
    <>
      <IonItem
        className={`${styles.list} ${styles['child-comment']} ${full_width}`}
        lines="none"
        key={`comment-${postId}-${parentId}-${id}`}
        id={`ion-comment-list-${id}`}
      >
        <div className={`${styles['comment-wrapper']} flex-column ${full_width}`}>
          <IonItem
            href={`#/user/${authorID}`}
            detail={false}
            lines="none"
            className={`${styles['child-author']} flex-row flex-align-center`}
          >
            {authorProfilePictureURL && (
              <img
                className={`${styles['comment-avatar']} ${styles['comment-avatar-child']}`}
                src={authorProfilePictureURL}
              />
            )}
            <IonText style={{ maxWidth: '80%' }} className="font500">
              {authorUsername}
            </IonText>
          </IonItem>
          <IonText className={`font400 ${id === selectedComment && styles['selected-comment']}`}>
            {parentAuthorUserName && (
              <IonText className={styles['author-tag']}>@{parentAuthorUserName}</IonText>
            )}
            {commentText}
          </IonText>
          <IonIcon
            className={styles['like-icon']}
            id={`like-icon-${postId}#${id}`}
            icon={!!myReaction ? heart : heartOutline}
            color={!!myReaction ? 'danger' : ''}
          />
          <div className={`${styles['comment-service']} flex-column`}>
            <AnswerBlock id={id} reactions={reactions} />
          </div>
        </div>
      </IonItem>

      {comments?.map((childComent: PropTypes) => {
        const {
          id: childId = '',
          authorUsername: childAU = '',
          commentText: childCT = '',
          createdAt: childCA = '',
          comments: childComments = [],
          reactions: childReactions,
          myReaction: childMyReaction,
          authorProfilePictureURL: childProfilePictureUrl,
          authorID: childAuthorId,
        } = childComent;
        return RenderComment({
          postId,
          authorUsername: childAU,
          commentText: childCT,
          createdAt: childCA,
          parentId: id,
          comments: childComments,
          parentAuthorUserName: authorUsername,
          id: childId,
          reactions: childReactions,
          myReaction: childMyReaction,
          authorProfilePictureURL: childProfilePictureUrl,
          authorID: childAuthorId,
          selectedComment,
        });
      })}
    </>
  );
}

export const getCommentId = (fullId: string, chunk: string): string => fullId?.replace(chunk, '');
