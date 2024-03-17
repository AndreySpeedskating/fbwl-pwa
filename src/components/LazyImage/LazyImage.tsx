import { FC, useState } from 'react';

import { IonImg, IonSkeletonText } from '@ionic/react';

import { IMAGE_SLIDER_CHUNK_ID } from '../../pages/Main/contsnats';
import { full_width } from '../../theme/variables';
import styles from './styles.module.css';

type PropTypes = {
  className?: string;
  index?: number;
  isReader?: boolean;
  isZoom?: boolean;
  onClick?: (e: any) => void;
  onImageAlreadyLoad?: () => void;
  postId?: string;
  url?: string;
};

const LazyImage: FC<PropTypes> = ({
  url,
  postId,
  index,
  className,
  isZoom,
  onImageAlreadyLoad,
  onClick,
  isReader,
}) => {
  const [loaded, setLoaded] = useState(false);

  const imageUpdate = (): void => {
    console.log('END LOAD IMG');
    onImageAlreadyLoad?.();
    setLoaded(true);
  };

  return (
    <>
      {isZoom ? (
        <img
          key={`image-${url}-zoom`}
          onLoad={imageUpdate}
          className="swiper-zoom-target"
          id={`image-${url}`}
          src={url}
          alt={''}
        />
      ) : (
        <IonImg
          key={`image-${url}-preview`}
          id={`${IMAGE_SLIDER_CHUNK_ID}#${postId}#${index}`}
          className={`${isReader ? styles.reader : styles.img} ${full_width} ${className}`}
          src={url}
          alt={''}
          onClick={onClick}
          onIonImgDidLoad={imageUpdate}
          onIonImgWillLoad={() => console.log('START LOAD IMG')}
        />
      )}
      {!loaded && (
        <IonSkeletonText animated style={{ width: '100%', height: '100%', borderRadius: 8 }} />
      )}
    </>
  );
};

export default LazyImage;
