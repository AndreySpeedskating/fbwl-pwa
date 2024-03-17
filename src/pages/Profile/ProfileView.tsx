import { useEffect, useRef, useState } from 'react';

import { IonButton, IonContent, IonLoading, IonPage, useIonActionSheet } from '@ionic/react';

import NavHeader from '../../components/NavHeader';
import { INotifyState, useNotify } from '../../store/slices/notify.slice';
import {
  addMyAvatarImage,
  changeMyInfo,
  deleteMyAvatarImage,
  getMyInformation,
} from '../../store/thunk/userThunk';
import { IMyInfo } from '../../utils/api/interface';
import { getObjectFromLs } from '../../utils/helpers';
import { useServiceHook } from '../../utils/hooks';
import { ProfileViewContent } from './content';
import styles from './styles.module.css';

const errorPayload: INotifyState = {
  message: 'Не удалось обновить данные пользователя',
  type: 'error',
  show: true,
};

const successPayload: INotifyState = {
  type: 'success',
  message: 'Данные успешно обновлены',
  show: true,
};

const CANCEL = {
  text: 'Отмена',
  role: 'cancel',
  data: {
    action: 'cancel',
  },
};

const ProfileView = (): JSX.Element => {
  const user = getObjectFromLs('-uio');
  const { history } = useServiceHook();
  const { setNotifyInfo } = useNotify();
  const [onSave] = useIonActionSheet();
  const [onCancel] = useIonActionSheet();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<IMyInfo | Record<string, undefined>>(user || {});
  const fileRef = useRef<File | null>(null);
  const deleteAvatar = useRef(false);
  const [error, setError] = useState('');

  const showMessage = (message: string, type: 'error' | 'success'): void => {
    setNotifyInfo({ message, type, show: true });
  };

  useEffect(() => {
    getMyInformation({
      cbSuccess: (data) => {
        setUserData(data);
      },
    });
  }, []);

  const onInputChange = (e: any): void => {
    const {
      target: { value, name },
    } = e;
    if (value?.length > 0) {
      setError(value?.replace(/\s/g, '')?.length === 0 ? name : '');
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadAvatar = async (): Promise<void> => {
    const formData = new FormData();
    formData.append('file', fileRef.current as any);
    formData.append('fileName', `${userData.publicUsername}-avatar`);
    await addMyAvatarImage({
      formData,
      id: userData.id || '',
    })
      .then(() => true)
      .catch(() => {
        showMessage('Ошибка загрузки аватара', 'error');
      })
      .finally(() => {
        fileRef.current = null;
      });
  };

  const completeButtonHandler = async (): Promise<void> => {
    setLoading(true);
    if (fileRef?.current && !deleteAvatar.current) {
      await uploadAvatar();
    }
    if (deleteAvatar.current) {
      await deleteMyAvatarImage({ id: userData?.id || '' });
    }
    await changeMyInfo({
      data: userData as IMyInfo,
    })
      .then(() => {
        getMyInformation({
          cbSuccess: () => {
            setNotifyInfo(successPayload);
            history.replace('/profile');
          },
        });
        return true;
      })
      .catch(() => {
        setNotifyInfo(errorPayload);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const actionSheetSave = (): any => {
    onSave({
      header: 'Созранить изменения',
      subHeader: 'Вы действительно хотите сохранить изменения ?',
      buttons: [
        {
          text: 'Сохранить',
          role: 'upload',
          data: {
            action: 'delete',
          },
        },
        CANCEL,
      ],
      onDidDismiss: async ({ detail }) => {
        if (detail.role === 'upload' && userData.id) {
          await completeButtonHandler();
        }
      },
    });
  };

  const actionSheetCancel = (): any => {
    if (JSON.stringify(user) !== JSON.stringify(userData)) {
      onCancel({
        header: 'Выйти ?',
        subHeader: 'Изменения не будут сохранены',
        buttons: [
          {
            text: 'Выйти',
            role: 'upload',
            data: {
              action: 'delete',
            },
          },
          CANCEL,
        ],
        onDidDismiss: ({ detail }) => {
          if (detail.role === 'upload' && userData.id) {
            history.replace('/profile');
          }
        },
      });
      return;
    }
    history.replace('/profile');
  };

  return (
    <IonPage>
      <NavHeader onBackClick={actionSheetCancel} title="Отображение профиля">
        <IonButton
          className={`${styles['complete-button']} button-transparent`}
          onClick={actionSheetSave}
        >
          Готово
        </IonButton>
      </NavHeader>
      <IonContent>
        <ProfileViewContent
          deleteAvatar={deleteAvatar}
          setData={setUserData}
          error={error}
          userData={userData}
          onInputChange={onInputChange}
          fileRef={fileRef}
        />
      </IonContent>
      <IonLoading isOpen={loading} />
    </IonPage>
  );
};

export default ProfileView;
