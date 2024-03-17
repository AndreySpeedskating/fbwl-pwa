import { FC } from 'react';
import { FreeMode } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { IonChip, IonText } from '@ionic/react';

import { setActiveTab } from '../../../store/slices/tab.slice';
import { useServiceHook } from '../../../utils/hooks';
import styles from './styles.module.css';

type PropTypes = {
  hashtags?: string[];
  onHashTagClick?: () => void;
};

const HashTags: FC<PropTypes> = ({ hashtags, onHashTagClick }) => {
  const { history } = useServiceHook();
  const onHashClickHandler = (e: any): void => {
    const tag = e?.target?.innerText;
    setActiveTab('Сериал');
    onHashTagClick?.();
    history.push(`/tile/${tag}`);
  };

  return (
    <Swiper
      direction="horizontal"
      freeMode
      className={`${styles['hashtag-swiper']}`}
      slidesPerView={'auto'}
      modules={[FreeMode]}
    >
      {hashtags?.map((tag) => (
        <SwiperSlide className={styles['hashtag-swiper-slide']} key={tag}>
          <IonChip className={styles['chip']}>
            <IonText id={'hashtags'} onClick={onHashClickHandler} className={styles.hashtag}>
              {tag?.replace('#', '')}
            </IonText>
          </IonChip>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HashTags;
