import { FC } from 'react';

import { IonNote } from '@ionic/react';

import { WarningIcon } from '../Icons';
import styles from './styles.module.css';

type PropTypes = {
  message: string;
};

const InputWarning: FC<PropTypes> = ({ message }) => (
  <IonNote className={`${styles['error']} font400`} slot="helper">
    <WarningIcon /> {message}
  </IonNote>
);

export default InputWarning;
