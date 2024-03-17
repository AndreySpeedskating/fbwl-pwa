/* eslint-disable */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useRef, useState } from 'react';

import { IonItem, IonLabel, IonList, IonLoading, IonToggle } from '@ionic/react';

import { useNotify } from '../../../../store/slices/notify.slice';
import { changeMyNotificationSettings, getMyInformation } from '../../../../store/thunk/userThunk';
import { IUserSettings } from '../../../../utils/api/interface';
import { getObjectFromLs } from '../../../../utils/helpers';
import { SETTINGS_ITEM } from '../MainProfile/MainProfile';
import { getNotifyPermission, unsubscribeNotifyPermission } from '../helpers';
import styles from '../styles.module.css';

const TOGGLE_LABEL = 'toggle-label';
const DEFAULT_SETTINGS = {
  push: false,
  pushCommentReplies: false,
  pushNewMessages: false,
};

const NotificationContent: FC = () => {
  const { settings } = getObjectFromLs('-uio') || {};
  const { setNotifyInfo } = useNotify();
  const pushSwitcherRef = useRef<HTMLIonToggleElement>(null);
  const [loading, setLoading] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<{
    push: boolean | null;
    pushCommentReplies: boolean | null;
    pushNewMessages: boolean | null;
  }>(settings);

  useEffect(
    () => () => {
      getMyInformation({});
    },
    []
  );

  const chnageToggleHandler = async (e: any): Promise<void> => {
    const {
      target: { checked, value },
    } = e;
    let subscribtion: PushSubscription | null = null;
    let clonedSetttings = { ...settings, [value]: checked } as IUserSettings;

    try {
      if (value === 'push' && !checked) {
        clonedSetttings = DEFAULT_SETTINGS;
        const unsubscride = await unsubscribeNotifyPermission();
        unsubscride &&
          setNotifyInfo({
            type: 'info',
            message: 'Вы успешно отписались от уведомлений',
            show: true,
          });
      }
      if (value === 'push' && checked) {
        subscribtion = await getNotifyPermission();
        if (!subscribtion) {
          setNotifyInfo({
            message: 'Разрешите push уведомления в настройках браузера',
            type: 'info',
            show: true,
          });
        }
      }
      console.log('clonedSetttings', clonedSetttings);
      await changeMyNotificationSettings({
        settings: clonedSetttings,
        cbSuccess: () => {
          setCurrentSettings(clonedSetttings);
        },
        cbFail: () => {
          setCurrentSettings(settings);
          setNotifyInfo({ message: 'Не удалось обновить настройки', type: 'error', show: true });
        },
      });
    } catch (error) {
      console.log('push subscribe error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonList className={`${styles['support-content']} flex-column`} lines="none">
      <IonItem className={styles[SETTINGS_ITEM]} lines="none">
        <IonLabel className={styles[TOGGLE_LABEL]}>Push-уведомления</IonLabel>
        <IonToggle
          ref={pushSwitcherRef}
          key={'push'}
          enableOnOffLabels={true}
          value={'push'}
          onClick={chnageToggleHandler}
          slot="end"
          checked={!!currentSettings?.push}
        ></IonToggle>
      </IonItem>
      {currentSettings?.push && (
        <>
          <IonItem className={styles[SETTINGS_ITEM]} lines="none">
            <IonLabel className={styles[TOGGLE_LABEL]}>Новые публикации</IonLabel>
            <IonToggle
              key={'pushNewMessages'}
              value={'pushNewMessages'}
              enableOnOffLabels={true}
              onClick={chnageToggleHandler}
              slot="end"
              checked={!!currentSettings?.pushNewMessages}
            ></IonToggle>
          </IonItem>
          <IonItem className={styles[SETTINGS_ITEM]} lines="none">
            <IonLabel className={styles[TOGGLE_LABEL]}>Ответы</IonLabel>
            <IonToggle
              key={'pushCommentReplies'}
              value={'pushCommentReplies'}
              enableOnOffLabels={true}
              onClick={chnageToggleHandler}
              slot="end"
              checked={!!currentSettings?.pushCommentReplies}
            ></IonToggle>
          </IonItem>
        </>
      )}
      <IonLoading isOpen={loading} />
    </IonList>
  );
};

export default NotificationContent;
