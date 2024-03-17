import { useEffect, useState } from 'react';

import { IonContent, IonPage, IonText } from '@ionic/react';

import NavHeader from '../../components/NavHeader';
import { Avatar } from '../../components/UI';
import { useNotify } from '../../store/slices/notify.slice';
import { getUserIformation } from '../../store/thunk/userThunk';
import { IMyInfo } from '../../utils/api/interface';
import { useServiceHook } from '../../utils/hooks';
import mainStyles from './styles.module.css';

const UserInfo = (): JSX.Element => {
  const { location } = useServiceHook();
  const { setNotifyInfo } = useNotify();
  const [user, setUser] = useState<IMyInfo | null>(null);

  useEffect(() => {
    if (location.pathname?.includes('/user/')) {
      const id = location.pathname.split('/').pop() || '';
      if (id) {
        const payload = {
          id,
          cbSuccess: (data: IMyInfo) => {
            setUser(data);
          },
          cbFail: () => {
            setNotifyInfo({
              type: 'error',
              show: true,
              message: 'При загрузке данных пользователя произошла ошибка, перезагрузите страницу',
            });
          },
        };
        getUserIformation(payload);
      }
    }
  }, [location.pathname]);

  return (
    <IonPage>
      <NavHeader href="#/main" title="Информация о пользователе" />
      <IonContent>
        <div className={`${mainStyles['user-info-container']} flex-column`}>
          <div className="flex-row flex-align-center">
            <Avatar url={user?.profilePictureURL} />
            <div className="flex-column">
              <IonText>{user?.publicUsername}</IonText>
              <IonText className="font400">{user?.email}</IonText>
            </div>
          </div>
          <div className={mainStyles['user-about']}>{user?.about}</div>
          <div className="flex-column">
            <IonText>Instagram</IonText>
            {user?.instagramProfile ? (
              <a
                href={user?.instagramProfile || ''}
                target="_blank"
                rel="noopener noreferrer"
                className="font400"
              >
                {user?.instagramProfile}
              </a>
            ) : (
              'Профиль не указан'
            )}
            <IonText>VK</IonText>
            {user?.vkProfile ? (
              <a
                href={user?.vkProfile || ''}
                target="_blank"
                rel="noopener noreferer noreferrer"
                className="font400"
              >
                {user?.vkProfile}
              </a>
            ) : (
              'Профиль не указан'
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserInfo;
