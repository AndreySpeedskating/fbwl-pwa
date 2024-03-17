import { ReactElement } from 'react';

import { IonText } from '@ionic/react';

import styles from './styles.module.css';

const Header = (): ReactElement => (
  <div className={`${styles['header']} flex-column`}>
    <IonText>Еще удобнее!</IonText>
    <IonText className={`${styles['description']}`}>Добавьте приложение на рабочий стол</IonText>
  </div>
);

export default Header;
