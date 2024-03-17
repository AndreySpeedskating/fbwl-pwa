import { FC, MutableRefObject, useEffect, useRef, useState } from 'react';

import {
  IonImg,
  IonInput,
  IonItem,
  IonLoading,
  IonText,
  IonTextarea,
  useIonActionSheet,
} from '@ionic/react';

import AddAvatar from '../../../../assets/image/addAvatar.png';
import InputWarning from '../../../../components/InputWarning';
import { Avatar } from '../../../../components/UI';
import { IMyInfo } from '../../../../utils/api/interface';
import { idGenerator } from '../../../../utils/helpers';
import { SETTINGS, SETTINGS_ITEM } from '../MainProfile/MainProfile';
import { SettingsInner } from '../MainProfile/components';
import styles from '../styles.module.css';

const PROFILE_CLASS_NAME = 'profile-view-content';
const INPUT_CLASS_NAME = 'input-field';

type PropTypes = {
  deleteAvatar: MutableRefObject<boolean>;
  error: string | null;
  fileRef: MutableRefObject<File | null>;
  onInputChange: (e: any) => void;
  setData: (data: IMyInfo) => void;
  userData: IMyInfo | Record<string, undefined>;
};

const ProfileViewContent: FC<PropTypes> = ({
  deleteAvatar,
  userData,
  onInputChange,
  error,
  setData,
  fileRef,
}) => {
  const [delPesent] = useIonActionSheet();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputKey] = useState<string>(idGenerator());
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    let input: HTMLInputElement | null = null;
    if (inputRef?.current) {
      input = inputRef.current;
      inputRef.current.addEventListener('click', getFileHandler);
    }

    return () => {
      if (input) {
        input.removeEventListener('click', getFileHandler);
      }
    };
  }, [inputRef]);

  const changeAvatarHandler = (e: any): void => {
    e?.stopPropagation();
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const deleteMyAvatar = (): void => {
    if (userData.id) {
      const clonedData = { ...userData } as IMyInfo;
      setData({ ...clonedData, profilePictureURL: '' });
      setAvatarPreview(null);
      deleteAvatar.current = true;
      fileRef.current = null;
    }
  };

  const actionSheetDeleteAvatar = (): any =>
    delPesent({
      header: 'Удаление аватара',
      subHeader: 'Вы действительно хотите удалить аватар ?',
      buttons: [
        {
          text: 'Удалить',
          role: 'destructive',
          data: {
            action: 'delete',
          },
        },
        {
          text: 'Отмена',
          role: 'cancel',
          cssClass: 'button-present-default',
          data: {
            action: 'cancel',
          },
        },
      ],
      onDidDismiss: ({ detail }) => {
        if (detail.role === 'destructive') {
          deleteMyAvatar();
        }
      },
    });

  function getFileHandler(e: any): void {
    const file = e?.target?.files?.[0] || null;
    if (file && fileRef) {
      setLoading(true);
      fileRef.current = file;
      const reader = new FileReader();

      reader.onload = function (e) {
        setAvatarPreview(e?.target?.result as string);
        setLoading(false);
      };
      reader.readAsDataURL(file);
      deleteAvatar.current = false;
    }
  }

  return (
    <>
      <IonItem
        className={`${styles[SETTINGS]} ${styles[SETTINGS_ITEM]} ${styles['margin-bottom']}`}
        lines="none"
      >
        <SettingsInner>
          {userData?.profilePictureURL || avatarPreview ? (
            <Avatar
              onClick={changeAvatarHandler}
              url={avatarPreview || userData?.profilePictureURL}
            />
          ) : (
            <IonImg
              onClick={changeAvatarHandler}
              style={{ width: 46, height: 46, margin: 'auto 12px auto 0' }}
              src={AddAvatar}
            />
          )}
          <div className="flex-column">
            <IonText>{userData?.publicUsername}</IonText>
            <IonText>{userData?.email}</IonText>
          </div>
        </SettingsInner>
      </IonItem>
      <IonItem
        className={`${styles[PROFILE_CLASS_NAME]} flex-column ${styles['delete-avatar-row']}`}
        lines="none"
      >
        <div className={`${styles['file-input-wrapper']} flex-row`}>
          <input
            ref={inputRef}
            key={inputKey}
            placeholder="Изменить фото профиля"
            type="file"
            autoComplete="off"
            onChange={getFileHandler}
            accept="image/png, image/jpeg"
            className={styles['file-input']}
            multiple={false}
          />
          {(userData?.profilePictureURL || avatarPreview) && (
            <span
              onClick={(e) => {
                e?.stopPropagation();
                actionSheetDeleteAvatar();
              }}
              className={styles['delete']}
            >
              Удалить фото профиля
            </span>
          )}
        </div>
      </IonItem>
      <IonItem className={`${styles[PROFILE_CLASS_NAME]} flex-column`} lines="none">
        <IonText>Ник</IonText>
        <IonInput
          name="publicUsername"
          placeholder="Введите Ник"
          value={userData?.publicUsername}
          className={styles[INPUT_CLASS_NAME]}
          onInput={onInputChange}
        />
        <div className={styles.error}></div>
        <IonText>Имя</IonText>
        <IonInput
          name="publicFirstName"
          placeholder="Введите имя"
          value={userData?.publicFirstName}
          className={styles[INPUT_CLASS_NAME]}
          onInput={onInputChange}
        />
        <div className={styles.error}>
          {error === 'about' && <InputWarning message="Имя не может быть пустым" />}
        </div>
        <IonText>Фамилия</IonText>
        <IonInput
          name="publicLastName"
          placeholder="Введите Фамилию"
          value={userData?.publicLastName}
          className={styles[INPUT_CLASS_NAME]}
          onInput={onInputChange}
        />
        <div className={styles.error}></div>
      </IonItem>
      <IonItem className={`${styles[PROFILE_CLASS_NAME]} flex-column`} lines="none">
        <IonText>Обо мне</IonText>
        <IonTextarea
          name="about"
          value={userData?.about}
          autoGrow
          className={styles[INPUT_CLASS_NAME]}
          onInput={onInputChange}
          placeholder="Расскажите о себе"
        />
        <div className={styles.error}>
          {error === 'about' && <InputWarning message="Сообщение не может быть пустым" />}
        </div>
      </IonItem>
      <IonItem className={`${styles[PROFILE_CLASS_NAME]} flex-column`} lines="none">
        <IonText>VK</IonText>
        <IonInput
          name="vkProfile"
          value={userData?.vkProfile}
          placeholder="Ссылка на VK"
          className={styles[INPUT_CLASS_NAME]}
          onInput={onInputChange}
        />
      </IonItem>
      <IonItem className={`${styles[PROFILE_CLASS_NAME]} flex-column`} lines="none">
        <IonText>Instagram</IonText>
        <IonInput
          name="instagramProfile"
          value={userData?.instagramProfile}
          placeholder="Ссылка на Instagram"
          className={styles[INPUT_CLASS_NAME]}
          onInput={onInputChange}
        />
      </IonItem>
      <div className={styles.error} />
      <IonLoading isOpen={loading} />
    </>
  );
};

export default ProfileViewContent;
