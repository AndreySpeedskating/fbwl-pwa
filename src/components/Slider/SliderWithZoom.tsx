import { FC } from 'react';
import { Pagination, Zoom } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// eslint-disable-next-line import/order
import { IFeedMedia } from '../../utils/api/interface';
import LazyImage from '../LazyImage/LazyImage';
import styles from './styles.module.css';
// eslint-disable-next-line import/no-unresolved
import 'swiper/css/bundle';
// eslint-disable-next-line import/no-unresolved
import 'swiper/css/pagination';
// eslint-disable-next-line import/no-unresolved
import 'swiper/css/zoom';
// eslint-disable-next-line import/no-unresolved
import 'swiper/css';

type PropTypes = {
  initSlide: number;
  postMedia: IFeedMedia[];
  needPagination?: boolean;
  onImageAlreadyLoad?: () => void;
};

export const SliderWithZoom: FC<PropTypes> = ({
  postMedia,
  initSlide,
  needPagination,
  onImageAlreadyLoad,
}) => (
  <Swiper
    modules={needPagination ? [Pagination, Zoom] : [Zoom]}
    initialSlide={initSlide || 0}
    zoom={true}
    pagination={{
      type: 'fraction',
    }}
    className={styles['swiper-with-zoom']}
  >
    {postMedia?.map(({ url, image }, i) => (
      <SwiperSlide className={styles['slide-with-zoom']} key={`${url}-${i}`}>
        {image && (
          <div className="swiper-zoom-container" data-swiper-zoom="3">
            <LazyImage onImageAlreadyLoad={onImageAlreadyLoad} key={url} isZoom url={url} />
          </div>
        )}
        {!image && (
          <video controls muted preload="metadata" autoPlay width="100%" height="100%" playsInline>
            <source src={url} />
          </video>
        )}
      </SwiperSlide>
    ))}
  </Swiper>
);

export default SliderWithZoom;
