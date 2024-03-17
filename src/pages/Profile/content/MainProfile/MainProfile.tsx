import {
  cardOutline,
  chevronForwardOutline,
  createOutline,
  logOutOutline,
  notificationsOutline,
  settingsOutline,
} from 'ionicons/icons';
import { ReactElement } from 'react';

import { IonIcon, IonItem, IonList, IonText, useIonActionSheet } from '@ionic/react';

import appData from '../../../../../package.json';
import { Avatar, Button } from '../../../../components/UI';
import { setRegistrationStatus } from '../../../../store/slices/auth.slice';
import { useUser } from '../../../../store/slices/user.slice';
import { full_width } from '../../../../theme/variables';
import { getObjectFromLs, isoDateToLocaleDate } from '../../../../utils/helpers';
import styles from '../styles.module.css';
import { SettingsInner } from './components';

export const SETTINGS = 'settings';
export const SETTINGS_ITEM = 'settings-item';
export const SETTINGS_ITEM_INNER = 'settings-item-inner';
export const MARGIN_LEFT = 'margin-left';

const ARROW_STYLE = { margin: 'auto 0 auto auto' };

const { settings } = styles;

const MainProfile = (): ReactElement => {
  const user = getObjectFromLs('-uio');
  const { subscribtion } = useUser();
  const [present] = useIonActionSheet();
  const { to = null, end = null } = subscribtion || {};

  const subsctiptionDate = isoDateToLocaleDate(to || '');

  const logoutHandler = (): void => {
    present({
      header: 'Выйти из аккаунта',
      subHeader: 'Вы уверены, что хотите выйти из аккаунта?',
      buttons: [
        {
          text: 'Выйти',
          role: 'destructive',
          data: {
            action: 'delete',
          },
        },
        {
          text: 'Отмена',
          cssClass: 'button-present-default',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
      onDidDismiss: ({ detail }) => {
        if (detail.role === 'destructive') {
          setRegistrationStatus('false');
        }
      },
    });
  };

  return (
    <>
      <IonItem
        className={`${settings} ${styles[SETTINGS_ITEM]} ${styles['margin-bottom']}`}
        lines="none"
        href="#/customization-user"
        detail={false}
      >
        <SettingsInner>
          <Avatar url={user?.profilePictureURL} />
          <div className="flex-column">
            <IonText>{user?.publicUsername}</IonText>
            <IonText className="font400">{user?.email}</IonText>
          </div>
        </SettingsInner>
      </IonItem>
      <IonList>
        <IonItem
          key="subscribe"
          href={end === false ? '#/subscribtion-info' : '#/profile'}
          detail={false}
          className={`${styles[SETTINGS_ITEM]}`}
        >
          <div className={`flex-column ${full_width}`}>
            <SettingsInner>
              <div className={`flex-column ${full_width}`}>
                <div className="flex-row">
                  <IonIcon icon={cardOutline} />
                  <IonText className={`${styles[MARGIN_LEFT]}`}>Подписка</IonText>
                </div>
                <IonText className={`${styles['subscribe-text']} font400 flex-row`}>
                  {end === false
                    ? `Статус подписки: Активна до ${subsctiptionDate}`
                    : 'Статус подписки: Неактивна'}
                </IonText>
                {end !== false && (
                  <Button
                    href="#/subscribe"
                    style={{
                      margin: '16px 0',
                      width: 188,
                    }}
                  >
                    Оформить подписку
                  </Button>
                )}
              </div>
            </SettingsInner>
          </div>
        </IonItem>
        <IonItem
          href="#/notification"
          detail={false}
          key="notifications"
          className={`${styles[SETTINGS_ITEM]}`}
        >
          <SettingsInner>
            <IonIcon icon={notificationsOutline} />
            <IonText className={`${styles[MARGIN_LEFT]}`}>Уведомления</IonText>
            <IonIcon style={ARROW_STYLE} icon={chevronForwardOutline} />
          </SettingsInner>
        </IonItem>
        {user?.role?.includes('ADMIN') && (
          <IonItem
            href="#/create"
            detail={false}
            key="create"
            className={`${styles[SETTINGS_ITEM]}`}
          >
            <SettingsInner>
              <IonIcon icon={createOutline} />
              <IonText className={`${styles[MARGIN_LEFT]}`}>Создать пост</IonText>
              <IonIcon style={ARROW_STYLE} icon={chevronForwardOutline} />
            </SettingsInner>
          </IonItem>
        )}
        <IonItem
          href="#/support"
          key="support"
          lines="none"
          detail={false}
          className={`${styles[SETTINGS_ITEM]}`}
        >
          <div className="flex-column">
            <div className={`${styles['support-line']} flex-row flex-align-center`}>
              <IonIcon icon={settingsOutline} />
              <IonText className={`${styles[MARGIN_LEFT]}`}>Служба поддержки</IonText>
            </div>
            <IonText className={`${styles['support']} font400 flex-row`}>
              Сообщить о проблеме
            </IonText>
            <IonText className={`${styles['support']} font400 flex-row`}>
              Предложить улучшение
            </IonText>
          </div>
        </IonItem>
        <SettingsInner onClick={logoutHandler}>
          <IonIcon icon={logOutOutline} />
          <IonText className={`${styles[MARGIN_LEFT]}`}>Выйти из аккаунта</IonText>
        </SettingsInner>
        <IonText className={`${styles[MARGIN_LEFT]}`}>Весия приложения {appData.version}</IonText>
      </IonList>
    </>
  );
};

export default MainProfile;
