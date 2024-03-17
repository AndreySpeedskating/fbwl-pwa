import { IonItem } from '@ionic/react';

import { getObjectFromLs } from '../../../../utils/helpers';
import styles from '../styles.module.css';

const SupportContent = (): JSX.Element => {
  const user = getObjectFromLs('-uio');

  return (
    <IonItem
      className={`${styles['support-content']} ${styles['iframe-wrapper']} flex-column`}
      lines="none"
    >
      <iframe
        src={`https://forms.yandex.ru/cloud/636fb7a0c769f130edb2ecb1/?iframe=1&username=${user?.publicUsername}&email=${user?.email}`}
        frameBorder="0"
        name="ya-form-636fb7a0c769f130edb2ecb1"
        width="100%"
        height="100%"
      ></iframe>
    </IonItem>
  );
};

export default SupportContent;
