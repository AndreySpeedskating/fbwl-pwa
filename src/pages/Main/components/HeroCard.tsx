import { FC } from 'react';

import { IonAvatar, IonText } from '@ionic/react';

import DefaultAvatar from '../../../assets/image/default.png';
import { IHero } from '../../../utils/api/interface';
import styles from './styles.module.css';

type PropTypes = {
  hero: IHero;
};

const HeroInformation: FC<PropTypes> = ({ hero }) => (
  <div className={styles['hero-container']}>
    <div className="flex-row flex-align-center">
      <IonAvatar className={styles['hero-avatar']}>
        <img src={hero?.profilePictureURL || DefaultAvatar} alt="" />
      </IonAvatar>
      <div className="flex-column">
        <IonText>{hero?.nickname}</IonText>
      </div>
    </div>
    <div>
      <IonText className={styles['hero-about']}>{hero?.about}</IonText>
    </div>
  </div>
);

export default HeroInformation;
