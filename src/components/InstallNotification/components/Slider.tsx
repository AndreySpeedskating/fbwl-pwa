import { FC } from 'react';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { IonImg, IonText } from '@ionic/react';

import styles from './styles.module.css';

type PropTypes = {
  slides: {
    extraText: string;
    image: string;
    text: string;
  }[];
};

const Slider: FC<PropTypes> = ({ slides }) => (
  <div className={styles['install-slider-wrapper']}>
    <Swiper
      modules={[Pagination]}
      pagination={{
        dynamicBullets: true,
      }}
      className="add-app-home-screen-manual-swiper"
    >
      {slides?.map(({ text, extraText, image }) => (
        <SwiperSlide
          key={`${text}-${extraText}`}
          className={`${styles['slide']} flex-column flex-align-center`}
        >
          <IonImg className={styles['slider-img']} src={image} />
          <IonText className={styles['text-color']}>
            {text} <IonText className={styles['notation-colored']}>{extraText}</IonText>
          </IonText>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

export default Slider;
