import { FC, HTMLAttributes } from 'react';

import { IonAvatar } from '@ionic/react';

import DefaultAvatar from '../../assets/image/default.png';
import styles from './avatar.module.css';

type PropTypes = {
  onClick?: (e: any) => void;
  url?: string;
};

export const Avatar: FC<HTMLAttributes<HTMLIonAvatarElement> & PropTypes> = ({
  onClick,
  url,
  style,
}) => (
  <IonAvatar style={style} onClick={onClick} className={styles['avatar']}>
    <img src={url || DefaultAvatar} alt="" />
  </IonAvatar>
);
