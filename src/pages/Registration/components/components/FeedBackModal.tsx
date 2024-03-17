import { ReactElement } from 'react';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import styles from './styles.module.css';

type PropTypes = {
  isOpen: boolean;
  onCancel: () => void;
};

export const FeedBackModal = ({ isOpen, onCancel }: PropTypes): ReactElement => (
  <IonModal isOpen={isOpen}>
    <IonHeader>
      <IonToolbar>
        <IonTitle className={styles.title}>Опишите проблему</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={onCancel}>Отмена</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen scrollY={true}>
      <div className={`${styles['feedback-content-modal']} flex-column flex-align-center`}>
        <iframe
          src={'https://forms.yandex.ru/cloud/639c5f04c769f1405b8fb317/?iframe=1'}
          frameBorder="0"
          name="ya-form-639c5f04c769f1405b8fb317"
          style={{ minHeight: 518, height: '85%', width: '100%' }}
        />
      </div>
    </IonContent>
  </IonModal>
);
