import { FC, ReactElement } from 'react';

import { IonLabel } from '@ionic/react';

import { SETTINGS_ITEM_INNER } from '../../MainProfile/MainProfile';
import styles from '../../styles.module.css';

type PropTypes = {
  children: ReactElement | ReactElement[];
  title: string;
};

const FieldWithTitle: FC<PropTypes> = ({ title, children }) => (
  <div className={`${styles[SETTINGS_ITEM_INNER]} full-width flex-column`}>
    <IonLabel position="stacked">{title}</IonLabel>
    {children}
  </div>
);

export default FieldWithTitle;
