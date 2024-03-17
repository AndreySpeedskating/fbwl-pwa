import { notifications } from 'ionicons/icons';
import { FC, useRef } from 'react';

import { IonContent, IonIcon, IonModal, IonText } from '@ionic/react';

import { getNotifyPermission } from '../../pages/Profile/content/helpers';
import { useNotify } from '../../store/slices/notify.slice';
import { changeMyNotificationSettings } from '../../store/thunk/userThunk';
import { Button } from '../UI';
import styles from './styles.module.css';

const FULL_PX = 268;
const INIT_L_BP = FULL_PX / window.innerHeight;

type PropTypes = {
  isOpen: boolean;
  onWillDismiss(): void;
};

const PushNotification: FC<PropTypes> = ({ isOpen, onWillDismiss }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const currentModalRef = useRef<HTMLIonModalElement>(null);
  const { setNotifyInfo } = useNotify();

  const subscribeButtonHandler = async (): Promise<void> => {
    await getNotifyPermission()
      .then(async (response) => {
        if (response) {
          await changeMyNotificationSettings({
            settings: {
              push: true,
              pushCommentReplies: true,
              pushNewMessages: true,
            },
          });
          setNotifyInfo({
            type: 'success',
            message: 'Поздравляем вы успешно подписаны на уведомления',
            show: true,
          });
        }
        return true;
      })
      .catch(() =>
        setNotifyInfo({ type: 'error', message: 'Ошибка подписки на уведомления', show: true })
      );

    onWillDismiss();
  };

  return (
    <IonModal
      key={'push-modal'}
      ref={currentModalRef}
      isOpen={!!isOpen}
      initialBreakpoint={INIT_L_BP}
      breakpoints={[0, INIT_L_BP]}
      handleBehavior="cycle"
      canDismiss
      onIonBreakpointDidChange={(e) => {
        if (e.detail.breakpoint === 0) {
          onWillDismiss?.();
        }
      }}
    >
      <IonContent className={`${styles['ion-content']} ion-padding`}>
        <div className={`flex-column flex-align-center ${styles['container']}`} ref={contentRef}>
          <IonText className="font16-22">
            Подпишись на уведомления и будь в курсе всех новостей
          </IonText>
          <IonIcon className={styles['push-icon']} icon={notifications} />
          <Button style={{ width: '90%' }} onClick={subscribeButtonHandler}>
            Подписаться
          </Button>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default PushNotification;
