/* eslint-disable sonarjs/cognitive-complexity */
import { heart, heartOutline, sendOutline } from 'ionicons/icons';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';

import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonRippleEffect,
  IonText,
  IonTextarea,
} from '@ionic/react';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';

import defaultAvatar from '../../assets/image/default.png';
import { returnTouchCoord, roundCoord } from '../../pages/Main/helpers';
import { useServiceStore } from '../../store/slices/service.slice';
import {
  loadFeedComments,
  removePostCommentReaction,
  setPostCommentReaction,
  setPostMessage,
} from '../../store/thunk/contentThunk';
import { full_width } from '../../theme/variables';
import { IFeedComment } from '../../utils/api/interface';
import { FIVEH, ONE, ONEH, THREEH } from '../../utils/constants';
import { getObjectFromLs } from '../../utils/helpers';
import { HashTags } from '../FeedCard/components';
import InputWarning from '../InputWarning';
import { HtmlContainer } from '../UI';
import AnswerBlock from './components/AnswerBlock';
import {
  ANSWER_BUTTON_CHUNK_ID,
  PARENT_START_ANSWER_CHUNK_ID,
  START_ANSWER_CHUNK_ID,
} from './constants';
import { RenderComment, getCommentId } from './helpers';
import styles from './styles.module.css';

type PropTypes = {
  comments: IFeedComment[];
  hashtags: string[];
  postId: string;
  onHashTagClick?: () => void;
  postText?: string;
  postUserName?: string;
};

const MAX_HEIGHT = 'max-height';
const ENTER_KEY = 13;

const CommentsList: FC<PropTypes> = ({
  comments,
  postId,
  postText,
  postUserName,
  hashtags,
  onHashTagClick,
}) => {
  const user = getObjectFromLs('-uio');
  const { likedComments } = useServiceStore();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const textAreaRef = useRef<HTMLIonTextareaElement>(null);
  const messageBlock = useRef<HTMLDivElement>(null);
  const lastClickedElm = useRef<string | null | undefined>(null);
  const pointerRef = useRef<{ pageX: number; pageY: number } | null>(null);
  const answerId = useRef<string | null>(null);
  const listRef = useRef<HTMLIonListElement>(null);
  const { isOpen, keyboardHeight } = useKeyboardState();
  const [showCommentAnswer, setShowCommentAnswer] = useState<string | null>(null);
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [commentMessage, setCommentMessage] = useState<string>('');
  const [commentMessageError, setCommentMessageError] = useState(false);
  const [showAnswerBlock, setShowAnswerBlock] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setTimeout(() => {
        showAnswerBottomBlock();
        setFocus();
      }, FIVEH);
    }
  }, [contentRef.current]);

  useEffect(() => {
    if (isOpen) {
      contentRef.current?.style.setProperty(MAX_HEIGHT, `calc(100% - 81px - ${keyboardHeight})`);
      return;
    }
    contentRef.current?.style.removeProperty(MAX_HEIGHT);
  }, [isOpen, keyboardHeight]);

  const setFocus = (): void => {
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.setFocus();
      }
    }, ONEH);
  };

  function answerShowController(id: string): void {
    setShowCommentAnswer(showCommentAnswer === id ? null : id);
  }

  function showAnswerBottomBlock(): void {
    setShowAnswerBlock(true);
  }

  function setMessage(e: ChangeEvent<HTMLIonTextareaElement>): void {
    const {
      target: { value },
    } = e;
    if (value && value?.replace(/\s/g, '')?.length > 0) {
      setCommentMessage(value?.replace(/(<([^>]+)>)/gi, ''));
      setCommentMessageError(commentMessageError && value?.length < ONE);
    }
  }

  function onTouchStart(e: any): void {
    e.stopPropagation();
    const [{ pageX, pageY }] = e.targetTouches;
    pointerRef.current = { pageX: roundCoord(pageX), pageY: roundCoord(pageY) };
  }

  const setCurrentCommentAnswer = (targetId: string, pattern: string): void => {
    const seletedId = getCommentId(targetId, `${pattern}-`);
    const element = document.getElementById(targetId);
    element?.scrollIntoView({ block: 'center' });
    seletedId !== answerId.current && showAnswerBottomBlock();
    setSelectedComment(seletedId);
    answerId.current = seletedId;
    setFocus();
  };

  function onTouchEnd(e: any): void {
    const { endPageX, endPageY } = returnTouchCoord(e);
    const { pageX: startPageX, pageY: startPageY } = pointerRef.current as {
      pageX: number;
      pageY: number;
    };
    if (endPageX === startPageX && endPageY === startPageY) {
      const targetId = e.target?.id;
      lastClickedElm.current = targetId;
      if (targetId?.includes?.(PARENT_START_ANSWER_CHUNK_ID)) {
        const seletedId = getCommentId(targetId, `${PARENT_START_ANSWER_CHUNK_ID}-`);
        showCommentAnswer !== seletedId && answerShowController(seletedId);
        setCurrentCommentAnswer(targetId, PARENT_START_ANSWER_CHUNK_ID);
        return;
      }
      if (targetId?.includes?.(START_ANSWER_CHUNK_ID)) {
        setCurrentCommentAnswer(targetId, START_ANSWER_CHUNK_ID);
        return;
      }
      if (targetId?.includes('like-icon-')) {
        const [targetPostId = '', commentId = ''] =
          targetId?.replace('like-icon-', '')?.split('#') || [];
        likedComments?.includes(commentId)
          ? removePostCommentReaction({
              postId: targetPostId,
              commentId,
              cbSuccess: () => {
                loadFeedComments({ id: postId });
              },
            })
          : setPostCommentReaction({
              postId: targetPostId,
              commentId,
              cbSuccess: () => {
                loadFeedComments({ id: postId });
              },
            });
      }
    }
  }

  const clearInputFocus = (): void => {
    answerId.current = null;
    setShowAnswerBlock(false);
    setCommentMessageError(false);
    setSelectedComment(null);
    setTimeout(() => {
      if (lastClickedElm?.current?.includes('start-answer')) {
        const targetId = lastClickedElm?.current;
        const isParrent = targetId?.includes(PARENT_START_ANSWER_CHUNK_ID);
        setCurrentCommentAnswer(
          targetId,
          isParrent ? PARENT_START_ANSWER_CHUNK_ID : START_ANSWER_CHUNK_ID
        );
      }
    }, THREEH);
  };

  const sendComment = (): void => {
    if (commentMessage?.length < ONE) {
      setCommentMessageError(true);
      return;
    }
    setPostMessage({
      id: postId,
      cbSuccess: async (): Promise<void> => {
        setCommentMessage('');
        try {
          await new Promise((resolve) => {
            setTimeout(() => resolve(true), THREEH);
            // eslint-disable-next-line promise/always-return
          }).then(() => {
            loadFeedComments({
              id: postId,
              cbSuccess: () => {
                textAreaRef.current?.setBlur();
              },
            });
          });
        } catch (err: any) {
          throw new Error(err?.message);
        }
      },
      data: {
        text: commentMessage,
        parentCommentId: answerId.current || undefined,
      },
    });
  };

  const keyBoardController = (e: any): void => {
    if (e?.keyCode === ENTER_KEY && commentMessage?.length > 0) {
      sendComment();
      return;
    }
    setCommentMessageError(e?.keyCode === ENTER_KEY && !commentMessage);
  };

  return (
    <>
      <IonContent
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        ref={contentRef}
        className={`${styles['scroll-container']} full-height ${full_width}`}
        fullscreen
      >
        <IonList ref={listRef} className={styles.content}>
          {postText && (
            <>
              <IonItem lines="none" className={styles.list}>
                <div className={`flex-column ${full_width}`}>
                  <IonText className="font500">{postUserName || 'forbarbie_withlove'}</IonText>
                  <HtmlContainer
                    id={`${START_ANSWER_CHUNK_ID}-`}
                    html={postText}
                    className="font400"
                  />
                  {hashtags && hashtags?.length > 0 && (
                    <HashTags onHashTagClick={onHashTagClick} hashtags={hashtags} />
                  )}
                </div>
              </IonItem>
              <div className={styles.devider} />
            </>
          )}
          {Array.isArray(comments) &&
            comments?.map(
              ({
                id,
                authorUsername,
                commentText,
                comments: childComments,
                reactions,
                myReaction,
                authorProfilePictureURL,
                authorID,
                createdAt,
              }) => (
                <IonItem
                  className={`${styles.list} ${styles.comment}`}
                  lines="none"
                  key={`comment-${postId}-${createdAt}`}
                  id={`ion-comment-list-${id}`}
                >
                  <div className={`${styles['comment-wrapper']} flex-column ${full_width}`}>
                    <IonItem
                      href={`#/user/${authorID}`}
                      detail={false}
                      className={`${styles.author} flex-row flex-align-center`}
                      lines="none"
                    >
                      <img
                        className={styles['comment-avatar']}
                        style={{ objectFit: 'cover' }}
                        src={authorProfilePictureURL || defaultAvatar}
                      />
                      <IonText style={{ maxWidth: '80%' }} className="font500">
                        {authorUsername}
                      </IonText>
                    </IonItem>
                    <IonText
                      data-id={id}
                      className={`font400 ${id === selectedComment && styles['selected-comment']}`}
                    >
                      <IonText className={styles['author-tag']}>
                        @{postUserName || 'forbarbie_withlove'}
                      </IonText>
                      {commentText}
                    </IonText>
                    <IonIcon
                      id={`like-icon-${postId}#${id}`}
                      icon={!!myReaction ? heart : heartOutline}
                      className={styles['like-icon']}
                      color={!!myReaction ? 'danger' : ''}
                    />
                    <div className={`${styles['comment-service']} flex-column`}>
                      <AnswerBlock id={id} reactions={reactions} isParent />
                      <div className={`${styles['child-comment-wrapper']} ${full_width}`}>
                        {showCommentAnswer?.includes(id) &&
                          childComments?.map((childComent, i) => {
                            const {
                              id: childId = '',
                              createdAt: childCA = '',
                              authorUsername: childAU = '',
                              comments: childComm = [],
                              commentText: childCT = '',
                              reactions: childReactions,
                              myReaction: childMyReaction,
                              authorProfilePictureURL: urlProfilePictureChild,
                              authorID: childAuthorId,
                            } = childComent;
                            return (
                              <RenderComment
                                key={`${childId}-${childCA}-${i}`}
                                authorUsername={childAU}
                                comments={childComm as any}
                                commentText={childCT}
                                createdAt={childCA}
                                id={childId}
                                parentId={id}
                                postId={postId}
                                reactions={childReactions}
                                parentAuthorUserName={authorUsername}
                                myReaction={childMyReaction}
                                authorProfilePictureURL={urlProfilePictureChild}
                                authorID={childAuthorId}
                                selectedComment={selectedComment}
                              />
                            );
                          })}
                      </div>

                      {childComments?.length > 0 && (
                        <IonButton
                          onClick={() => {
                            answerShowController(getCommentId(id, `${ANSWER_BUTTON_CHUNK_ID}-`));
                          }}
                          id={`${ANSWER_BUTTON_CHUNK_ID}-${id}`}
                          className={`${styles['answer-button']} ${styles['show-button']} button-transparent font400`}
                        >
                          {showCommentAnswer?.includes(id) ? 'Скрыть ответы' : 'Показать ответы'}
                          <IonRippleEffect></IonRippleEffect>
                        </IonButton>
                      )}
                    </div>
                  </div>
                </IonItem>
              )
            )}
        </IonList>
      </IonContent>
      {showAnswerBlock && (
        <div ref={messageBlock} className={`${styles['write-message-block']} flex-row`}>
          <img
            className={styles['comment-avatar']}
            src={user?.profilePictureURL || defaultAvatar}
            style={{ objectFit: 'cover' }}
            alt="avatar"
          />
          <IonTextarea
            ref={textAreaRef}
            className={`${styles['text-area']} ${
              commentMessageError ? styles['error'] : ''
            } font400 font14-19`}
            value={commentMessage}
            placeholder="Комментировать"
            onInput={setMessage}
            minlength={2}
            maxlength={496}
            onIonBlur={clearInputFocus}
            enterkeyhint="send"
            onKeyUp={keyBoardController}
            rows={1}
          />
          <IonIcon onTouchEnd={sendComment} className={styles['send-button']} icon={sendOutline} />
          {commentMessageError && (
            <div className={`${styles['error-message']} flex-row`}>
              <InputWarning message="Сообщение не может быть пустым" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CommentsList;
