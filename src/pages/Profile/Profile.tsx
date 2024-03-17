import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import { MainProfile } from './content';
import styles from './styles.module.css';

const Profile = (): JSX.Element => (
  <IonPage>
    <IonHeader>
      <IonToolbar className={styles['ion-header']}>
        <IonTitle className={styles.title}>Профиль</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <MainProfile />
    </IonContent>
  </IonPage>
);

export default Profile;
