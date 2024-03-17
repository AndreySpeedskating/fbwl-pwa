/* eslint-disable @typescript-eslint/no-unused-vars */
import { settingsOutline } from 'ionicons/icons';
import { FC, memo } from 'react';

import { IonButton, IonIcon, useIonActionSheet } from '@ionic/react';

import AuthorImg from '../../../assets/image/author.webp';
import { removeFeed, useFeedStore } from '../../../store/slices/content.slice';
import { useNotify } from '../../../store/slices/notify.slice';
import { useUser } from '../../../store/slices/user.slice';
import { deleteFeed, loadFeedListBySection } from '../../../store/thunk/contentThunk';
import { FIVEH } from '../../../utils/constants';
import { getObjectFromLs } from '../../../utils/helpers';
import { useDebounceCallback, useServiceHook } from '../../../utils/hooks';
import useLoadFeedsAndComments from '../../../utils/hooks/useLoadFeedsAndComments';
import styles from './styles.module.css';

type PropTypes = {
  id?: string;
  isDraft?: boolean;
  menuItem?: 'backstage' | 'heroes' | 'serial' | 'video';
  sectionId?: string;
  title?: string;
};

const CSS_BUTTON_CN = 'button-present-default';

const CANCEL_BUTTON = {
  text: 'Отмена',
  role: 'cancel',
  cssClass: CSS_BUTTON_CN,
  data: {
    action: 'cancel',
  },
};

const DELET_BUTTON = {
  text: 'Удалить',
  role: 'destructive',
  data: {
    action: 'delete',
  },
};

const Author: FC<PropTypes> = ({ title, id, isDraft, sectionId, menuItem }) => {
  const { history, location } = useServiceHook();
  const delayCb = useDebounceCallback(FIVEH);
  const { loadDraftFeeds } = useLoadFeedsAndComments();
  const { setLastPost } = useUser();
  const { setNotifyInfo } = useNotify();
  const { feeds } = useFeedStore();
  const [present] = useIonActionSheet();
  const [represent] = useIonActionSheet();
  const user = getObjectFromLs('-uio');

  const goToAuthtor = (e: any): void => {
    e?.stopPropagation();
    e?.preventDefault();
    history.push('/authtor');
  };

  const deletePostCb = (): void => {
    if (location.pathname.includes('/post/')) {
      const deletedIndex = feeds?.[menuItem || 'serial']?.findIndex((feed) => feed?.id === id);
      history.push(
        `/post/${feeds[menuItem || 'serial'][deletedIndex !== 0 ? deletedIndex - 1 : 0]?.id}`
      );
      return;
    }
    if (sectionId) {
      loadFeedListBySection({
        sectionId,
        cbSuccess: (data) => {
          const sectionPosts = data?.[0];
          setLastPost({ id: sectionPosts?.id || '', sectionId });
          history.replace(`/post-reader/${sectionId}/${sectionPosts?.id}`, {});
        },
      });
    }
  };

  const showVariants = (): Promise<void> =>
    present({
      header: 'Выберите действие',
      buttons: [
        {
          text: 'Редактировать',
          role: 'edit',
          cssClass: CSS_BUTTON_CN,
          data: {
            action: 'edit',
          },
        },
        DELET_BUTTON,
        CANCEL_BUTTON,
      ],
      onDidDismiss: ({ detail }) => {
        if (detail?.role === 'edit') {
          history.push(`/create?id=${id}`);
          return;
        }
        if (detail?.role === DELET_BUTTON.role) {
          deletePost();
        }
      },
    });

  const deletePost = async (): Promise<void> =>
    represent({
      header: 'Вы действительно хотите удалить пост ?',
      buttons: [DELET_BUTTON, CANCEL_BUTTON],
      onDidDismiss: ({ detail }) => {
        if (detail?.role === DELET_BUTTON.role) {
          deleteFeed({
            postId: id || '',
            cbSuccess: () => {
              setNotifyInfo({ type: 'success', message: 'Пост успешно удален', show: true });
              delayCb(deletePostCb);
              isDraft ? loadDraftFeeds() : removeFeed(id || '', menuItem || 'serial');
            },
            cbFail: () => {
              setNotifyInfo({ type: 'error', message: 'Ошибка удаления поста', show: true });
            },
          });
        }
      },
    });

  return (
    <div className={`${styles['author-wrapper']} flex-row full-width`}>
      <img
        onClick={goToAuthtor}
        width={42}
        height={42}
        style={{ borderRadius: '100%' }}
        src={AuthorImg}
        alt="avatar"
      />
      <div className="flex-column">
        <span onClick={goToAuthtor} className={`${styles['author-title']} font500`}>
          forbarbie_withlove
        </span>
        <span className="font400">{title}</span>
      </div>
      {user?.role?.includes('ADMIN') && (
        <IonButton
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: 'auto 0 auto auto',
            color: '#000',
            '--padding-end': '4px',
          }}
          className={`${styles['author-title']} font500 button-transparent`}
          onClick={showVariants}
        >
          {isDraft && 'Черновик'}
          <IonIcon slot="end" icon={settingsOutline}></IonIcon>
        </IonButton>
      )}
    </div>
  );
};

export default memo(Author);
