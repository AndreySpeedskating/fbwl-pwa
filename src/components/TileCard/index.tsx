import { copy, heart, lockClosed, play } from 'ionicons/icons';
import { FC } from 'react';

import { IonIcon, IonImg, IonItem } from '@ionic/react';

import Banner from '../../assets/image/banner.webp';
import { IFeed, IFeedMedia } from '../../utils/api/interface';
import { getObjectFromLs } from '../../utils/helpers';
import { useServiceHook } from '../../utils/hooks';
import LazyImage from '../LazyImage/LazyImage';
import styles from './styles.module.css';

type PropTypes = {
  feed: IFeed;
  isBig?: boolean;
};

const TileCard: FC<PropTypes> = ({ feed, isBig = false }) => {
  const user = getObjectFromLs('-uio');
  const { history } = useServiceHook();
  const media: IFeedMedia = feed?.postMedia?.[0] || null;
  const { myReaction, id } = feed;

  return (
    <IonItem
      detail={false}
      id={feed?.lastPageElement ? `page-${feed?.lastPageElement}` : ''}
      className={`${styles['content-wrapper']} ${isBig ? styles.big : ''}`}
      onClick={() => {
        history.push(
          user?.level === 'free' && feed?.level === 'paid' ? '/subscribe' : `/post/${id}`
        );
      }}
    >
      {media && media?.image && (
        <LazyImage
          key={media?.url}
          url={media?.thumbnail || media?.url}
          className={styles['full-height']}
        />
      )}
      {media && !media?.image && (
        <video
          className={styles['video']}
          autoPlay = {feed.menuItem === 'heroes'}
          preload= {feed.menuItem === 'heroes' ? 'metadata' : 'none'}
          poster = {media.thumbnail}
          playsInline
          muted
          width="100%"
          height="100%"
        >
          <source src={`${media?.url}#t=0,5`} type={media?.mime} />
        </video>
      )}
      {media && (
        <IonIcon
          color="light"
          icon={!media?.image ? play : copy}
          className={`${isBig ? styles['big-icons'] : ''} ${styles.icons}`}
        />
      )}
      {myReaction && (
        <IonIcon
          className={`${isBig ? styles['big-icons'] : ''} ${styles['like-icon']} ${
            isBig && styles['like-icon-big']
          }`}
          color="danger"
          icon={heart}
        />
      )}
      {user?.level === 'free' && feed?.level === 'paid' && (
        <>
          <IonImg
            className={`${styles.img} ${styles['img-blur']}`}
            src={Banner}
            alt={'post content'}
          />
          <div className={styles['pay-content']}>
            <IonIcon icon={lockClosed} />
            Платный контент
          </div>
        </>
      )}
    </IonItem>
  );
};

export default TileCard;
