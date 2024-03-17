import { FC, useEffect, useRef } from 'react';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { IonImg } from '@ionic/react';

import Banner from '../../assets/image/banner.webp';
import { full_width } from '../../theme/variables';
import { IFeedMedia, menuItem } from '../../utils/api/interface';
import LazyImage from '../LazyImage/LazyImage';
import styles from './styles.module.css';
// eslint-disable-next-line import/no-unresolved
import 'swiper/css/pagination';

type PropTypes = {
  postMedia: IFeedMedia[];
  isDraft?: boolean;
  isFull?: boolean;
  isReader?: boolean;
  menuItem?: menuItem;
  onImageAlreadyLoad?: () => void;
  onImageClick?: (e: any) => void;
  postId?: string;
};

export const Slider: FC<PropTypes> = ({
  postMedia,
  isFull,
  postId,
  isDraft,
  onImageAlreadyLoad,
  onImageClick,
  isReader,
  menuItem,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef?.current) {
      const pagination = wrapperRef?.current?.getElementsByClassName('swiper-pagination')?.[0];
      wrapperRef.current.appendChild(pagination);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapperRef.current]);

  return (
    <div ref={wrapperRef} className={styles['slider-wrapper']}>
      <Swiper
        modules={isFull ? [Pagination] : []}
        pagination={{
          dynamicBullets: true,
        }}
        className={`${styles['slider']}`}
      >
        {postMedia?.length > 0 &&
          postMedia?.map(({ url, image, mime, thumbnail }, i) => (
            <SwiperSlide
              className={`${styles.slide} ${styles['slide-with-zoom']}`}
              key={`${url}-${i}`}
            >
              <div className={styles['img-wrapper']}>
                {image && (
                  <LazyImage
                    onImageAlreadyLoad={onImageAlreadyLoad}
                    key={url}
                    url={thumbnail || url}
                    postId={postId}
                    index={i}
                    onClick={onImageClick}
                    isReader={isReader}
                  />
                )}
                {!image && mime?.includes('video') && (
                  <video
                    key = {url}
                    muted
                    controls
                    preload= {menuItem === 'heroes' ? 'metadata' : 'none'}
                    playsInline
                    autoPlay = {menuItem === 'heroes'}
                    width="100%"
                    height="100%"
                    poster = {thumbnail}
                  >
                    <source src={url} />
                  </video>
                )}
              </div>
            </SwiperSlide>
          ))}
        {!isDraft && !postMedia?.length && (
          <SwiperSlide
            className={`${styles.slide} ${styles['slide-with-zoom']}`}
            key={`$banner-${postId}`}
          >
            <div className={styles['img-wrapper']}>
              <IonImg
                id={`banner-${postId}`}
                className={`${styles.img} ${full_width}`}
                src={Banner}
                alt={''}
                onIonImgDidLoad={onImageAlreadyLoad}
              />
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};

export default Slider;
