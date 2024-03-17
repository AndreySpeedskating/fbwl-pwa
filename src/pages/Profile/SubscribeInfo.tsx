import { cardOutline } from 'ionicons/icons';

import { IonButton, IonContent, IonIcon, IonPage, IonText } from '@ionic/react';

import NavHeader from '../../components/NavHeader';
import { Button } from '../../components/UI';
import { useNotify } from '../../store/slices/notify.slice';
import { useUser } from '../../store/slices/user.slice';
import { removeAutoprolongation, setAutoprolongation } from '../../store/thunk/subscribeThunk';
import { getMySubscribeStatus } from '../../store/thunk/userThunk';
import { full_width } from '../../theme/variables';
import { isoDateToLocaleDate } from '../../utils/helpers';
import { MARGIN_LEFT, SETTINGS_ITEM_INNER } from './content/MainProfile/MainProfile';
import styles from './content/styles.module.css';

const SubscribeInfo = (): JSX.Element => {
  const { setNotifyInfo } = useNotify();
  const { subscribtion } = useUser();
  const { autoProlong, end, to, price, autoProlongationAllowed } = subscribtion || {};
  const subsctibtionDate = isoDateToLocaleDate(to || '');

  const successNotify = (message: string): void => {
    setNotifyInfo({
      message,
      type: 'success',
      show: true,
    });
  };

  const errorNotify = (message: string): void => {
    setNotifyInfo({
      message,
      type: 'error',
      show: true,
    });
  };

  const eableAutoProlong = (): void => {
    const payload = {
      cbSuccess: () => {
        successNotify('Автопродление успешно подключено');
        getMySubscribeStatus({});
      },
      cbFail: () => {
        errorNotify('Возникла ошибка повторите операцию');
      },
    };
    setAutoprolongation(payload);
  };

  const disableAutoProlong = (): void => {
    const payload = {
      cbSuccess: () => {
        successNotify('Автопродление успешно отключено');
        getMySubscribeStatus({});
      },
      cbFail: () => {
        errorNotify('Возникла ошибка повторите операцию');
      },
    };
    removeAutoprolongation(payload);
  };

  return (
    <IonPage>
      <NavHeader href="#/profile" title="Подписка" />
      <IonContent>
        <div
          className={`${styles[SETTINGS_ITEM_INNER]} ${styles['subscribtion-info']} flex-row ${full_width} flex-align-center`}
        >
          <div className={`flex-column ${full_width}`}>
            <div className="flex-row">
              <IonIcon icon={cardOutline} />
              <IonText className={`${styles[MARGIN_LEFT]}`}>Подписка</IonText>
            </div>
            {end === false && (
              <IonText className={`${styles['subscribe-text']} font400 flex-row`}>
                {autoProlong === true
                  ? `${subsctibtionDate} спишется ${price}₽`
                  : `Активна до ${subsctibtionDate}`}
              </IonText>
            )}
          </div>
          {autoProlongationAllowed && autoProlong === false && (
            <IonButton
              href="#/subscribe"
              className={`${styles['button']} ${styles['subscribe-button']} button-transparent`}
            >
              <span className={styles['fake-input']}>Продлить</span>
            </IonButton>
          )}
        </div>
        {autoProlongationAllowed && (
          <Button
            onClick={autoProlong ? disableAutoProlong : eableAutoProlong}
            style={{
              margin: '16px 20px',
            }}
          >
            {autoProlong ? 'Отключить автопродление' : 'Подключить автопродление'}
          </Button>
        )}
      </IonContent>
    </IonPage>
  );
};

export default SubscribeInfo;
