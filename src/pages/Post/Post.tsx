import { ReactElement } from 'react';

import { IonContent, IonPage } from '@ionic/react';

import NavHeader from '../../components/NavHeader';
import { useServiceHook } from '../../utils/hooks';
import FeedContent from './FeedContent';
import styles from './styles.module.css';

const Post = (): ReactElement => {
  const { history } = useServiceHook();
  return (
    <IonPage>
      <NavHeader
        onClick={() => {
          history.goBack();
        }}
      >
        Назад
      </NavHeader>
      <IonContent className={`${styles['page']} ion-padding`} fullscreen>
        <FeedContent />
      </IonContent>
    </IonPage>
  );
};

export default Post;
