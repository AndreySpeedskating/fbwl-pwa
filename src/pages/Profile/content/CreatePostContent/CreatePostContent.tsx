/* eslint-disable sonarjs/prefer-immediate-return */
import { trashOutline } from 'ionicons/icons';
import { Jodit } from 'jodit';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import {
  IonAccordion,
  IonAccordionGroup,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonText,
  IonTextarea,
  IonToggle,
  ItemReorderEventDetail,
} from '@ionic/react';

import { Button } from '../../../../components/UI';
import { useFeedStore } from '../../../../store/slices/content.slice';
import { useNotify } from '../../../../store/slices/notify.slice';
import { useUser } from '../../../../store/slices/user.slice';
import { getFeedById } from '../../../../store/thunk/contentThunk';
import { contentApi } from '../../../../utils/api';
import { ONE } from '../../../../utils/constants';
import { useServiceHook } from '../../../../utils/hooks';
import useLoadFeedsAndComments from '../../../../utils/hooks/useLoadFeedsAndComments';
import { SETTINGS, SETTINGS_ITEM, SETTINGS_ITEM_INNER } from '../MainProfile/MainProfile';
import styles from '../styles.module.css';
import { DateSelect, FieldWithTitle, MenuSelect, ReorderFile, UploaderImageVideo } from './components';
import { EStatus, ICPost, IMedia, INITIAL_POST_DATA, MENU_ITEM_LIST } from './constants';
import { convertDate, readUploadedFileAsText } from './helpers';
import localStyles from './styles.module.css';

const { input, slide, reorder } = localStyles;

const CreatePostContent = (): JSX.Element => {
  const { location } = useServiceHook();
  const { loadDraftFeeds } = useLoadFeedsAndComments();
  const editor = useRef<Jodit>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setNotifyInfo } = useNotify();
  const { lastReaderPost } = useUser();
  const { feeds, draftFeeds, feedBySections } = useFeedStore();
  const formFileRef = useRef<File[]>([]);
  const [fileList, setFileList] = useState<{ startIndex: number; url: string, name?: string, type?: string }[]>([]);
  const [fileImageList, setFileImageList] = useState<{[key: string]: {file: File, url: string} }>({});
  const [post, setPost] = useState<ICPost>(INITIAL_POST_DATA);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location?.search) {
      const params = new URLSearchParams(location?.search);
      const queryId = params.get('id');
      const { sectionId } = lastReaderPost || {};
      const findSectionFeed = feedBySections?.[sectionId || '']?.feed?.find(
        (feed) => feed?.id === queryId
      );
      const currentFeed = [...draftFeeds, ...Object.values(feeds).flat(1)]?.find(
        (feed) => feed.id === queryId
      );
      setPost((currentFeed as ICPost) || findSectionFeed);
    }
    return () => {
      setPost(INITIAL_POST_DATA);
    };
  }, [location?.search]);


  useEffect(() => {
    if (editor.current) {
      const jodit = Array.from(document.querySelectorAll('div[contenteditable="true"]'));
      if (jodit?.length) {
        const changeHandler = (e: any): void => {
          const newContent = e.clipboardData.getData('text');
          setPost((prev) => ({ ...prev, postText: newContent }));
        };
        (jodit[0] as any).onpaste = changeHandler;
      }
    }
  }, [editor.current]);

  const previwFile = async (files?: FileList): Promise<void> => {
    if (files && files?.length > 0) {
      setLoading(true);
      const filesList = Array.from(files);
      formFileRef.current = [...formFileRef.current, ...filesList];
      const calls = filesList?.map(async (file, i) => {
        const fileData = await readUploadedFileAsText(file, i).then((r) => r);
        return fileData;
      });
      await Promise.all(calls)
        .then((value) => {
          setFileList((prev) => [...prev, ...value]);
          return value;
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const getFileHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e?.target?.files || [];
    previwFile(files as FileList);
  };

  const setVideoImage = async (e: ChangeEvent<HTMLInputElement>, key?: string): Promise<void> => {
    if (key) {
      const files = e?.target?.files || [];
// eslint-disable-next-line prefer-destructuring
      const file = files[0];
      if (file) {
        const { url } = await readUploadedFileAsText(file, 0).then((r) => r);
        setFileImageList((prev) => ({ ...prev, [key]: { file: files[0], url } }));
      }
    }
  };

  const uploadFileStartHandler = (): void => {
    if (inputRef?.current) {
      inputRef.current.click();
    }
  };

  const createPost = async (): Promise<void> => {
    setLoading(true);
    await contentApi
      .createPost(post as any)
      .then(({ data }) => {
        const { id, title, postText, menuItem, level, status } = data;
        setPost((prev) => ({ ...prev, id, title, postText, menuItem, level, status }));
        loadDraftFeeds();
        return data;
      })
      .catch(() => {
        setNotifyInfo({ type: 'error', show: true, message: 'Ошибка создания поста' });
        return false;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updatePost = async (): Promise<void> => {
    setLoading(true);
    await contentApi
      .updatePost(post?.id || '', post as any)
      .then(() => {
        setNotifyInfo({ type: 'success', show: true, message: 'Пост успешно обновлен' });
        post?.status === 'draft'
          ? loadDraftFeeds()
          : getFeedById({
              id: post.id || '',
            });
        setPost(INITIAL_POST_DATA);
        return true;
      })
      .catch(() => {
        setNotifyInfo({ type: 'error', show: true, message: 'Ошибка обновления данных поста' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleReorder = (event: CustomEvent<ItemReorderEventDetail>): void => {
    const posts = [...post.postMedia];
    setPost((prev) => ({ ...prev, postMedia: event.detail.complete(posts) }));
    event.detail.complete();
  };

  const uploadFile = async (): Promise<void> => {
    if ((formFileRef?.current || Object.keys(fileImageList)) && post?.id) {
      setLoading(true);
      const uploadList = formFileRef?.current?.map(async (file) => {
        const form = new FormData();
        form.append('file', file, file.name);
        const media: { data: IMedia } = await contentApi.addPostMedia(post.id || '', form);
        if (fileImageList[file.name]) {
          const newForm = new FormData();
          newForm.append('file', fileImageList[file.name].file, fileImageList[file.name].file.name);
          const imageMedia: {data: IMedia} = await contentApi.addPostMedia(post.id || '', newForm);
          if (media?.data) {
            media.data.thumbnail = imageMedia?.data.url;
          }
        }
        return media?.data;
      });
      const createFormDate: (file: File) => FormData = (file: File) => {
        const form = new FormData();
        form.append('file', file, file.name);
        return form;
      };
      const uploadedList = post.postMedia.map(async (file) => {
        if (fileImageList[file.url]?.file) {
          const media: { data: IMedia } = await contentApi.addPostMedia(post.id || '', createFormDate(fileImageList[file.url]?.file));
          return Object.assign(file, { thumbnail: media?.data.url })
        }
        return file
      });
      await Promise.all(uploadList.concat(uploadedList))
        .then((list) => {
          const currentList = list?.filter(Boolean);
          if ((formFileRef.current && currentList?.length > 0)) {
            setFileList([]);
            setFileImageList({});
            formFileRef.current = [];
            setPost((prev) => ({ ...prev, postMedia: [...currentList] }));
          } else {
            setNotifyInfo({ type: 'error', show: true, message: 'Ошибка загрузки медиа фаилов' });
          }
          return list;
        })
        .catch(() => {
          setNotifyInfo({ type: 'error', show: true, message: 'Ошибка загрузки медиа фаилов' });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const removeFile = (index: number): void => {
    setFileList((prev) => prev.filter?.((_, i) => i !== index));
    if (formFileRef?.current) {
      formFileRef.current = formFileRef?.current?.filter((_, i) => i !== index);
    }
  };

  const onFileDelete = (index: number): void => {
    const files = post?.postMedia;
    if (files?.length) {
      setPost((prev) => ({ ...prev, postMedia: files?.filter((_, i) => index !== i) }));
    }
  };

  return (
    <div
      className={`${styles[SETTINGS]} ${styles[SETTINGS_ITEM]} ${styles['margin-bottom']} flex-column`}
    >
      <FieldWithTitle key="title-post" title="Название поста">
        <IonInput
          placeholder="Введите название поста"
          className={input}
          value={post?.title}
          onInput={(e: ChangeEvent<HTMLIonInputElement>) => {
            const value = e?.target?.value;
            setPost((prev) => ({ ...prev, title: `${value}` }));
          }}
        ></IonInput>
      </FieldWithTitle>
      <FieldWithTitle key="text-post" title="Текст поста">
        <IonTextarea
          className={localStyles['content-editable-div']}
          value={post?.postText}
          autoGrow={true}
          onInput={function (e: any) {
            setPost((prev) => ({ ...prev, postText: `${e?.target?.value}` }));
          }}
          onBlur={function (e: any) {
            setPost((prev) => ({ ...prev, postText: `${e?.target?.value}` }));
          }}
        />
      </FieldWithTitle>
      <FieldWithTitle key="menu-item-post" title="Раздел меню">
        <MenuSelect
          value={post?.menuItem || 'serial'}
          list={MENU_ITEM_LIST}
          onSet={(value: string) => setPost((prev) => ({ ...prev, menuItem: value }))}
        />
      </FieldWithTitle>
      <FieldWithTitle
        key="tax-level-post"
        title={`Платный контент - ${post?.level === 'paid' ? 'Да' : 'Нет'}`}
      >
        <IonToggle
          value={post?.level}
          enableOnOffLabels={true}
          onIonChange={function (e) {
            const {
              detail: { checked },
            } = e;
            setPost((prev) => ({ ...prev, level: checked ? 'paid' : 'free' }));
          }}
          slot="end"
          checked={post?.level === 'paid'}
        ></IonToggle>
      </FieldWithTitle>
      {post?.id && (
        <IonAccordionGroup>
          <IonAccordion value="media">
            <IonItem slot="header" color="light">
              <IonLabel>Медиа</IonLabel>
            </IonItem>
            <div className="ion-padding flex-column full-width align-center" slot="content">
              <Button onClick={uploadFileStartHandler}>Выбрать Медиа</Button>
              <div className={`${styles[SETTINGS_ITEM_INNER]} full-width`}>
                <input
                  ref={inputRef}
                  style={{ position: 'absolute', top: -200, zIndex: -10 }}
                  autoComplete="false"
                  type="file"
                  placeholder="добавьте фаил"
                  multiple
                  onChange={getFileHandler}
                ></input>
              </div>
              <IonList className={fileList?.length ? reorder : ''}>
                { fileList?.map(({ url, type, name }, i) => (
                  <IonItem className={styles['reorder-item']} key={name || url}>
                    <div className="flex-row flex-align-center">
                      {url?.includes('data:video') ? (
                        <video width={128} height={128} muted playsInline preload="metadata">
                          <source src={`${url}#t=0,5`} type="video/mp4" />
                        </video>
                      ) : (
                        <img width={128} height={128} src={url} alt="" />
                      )}
                      <IonText className={slide}>{`Фаил ${i + ONE}`} </IonText>
                    </div>
                    {type?.includes('video') && (
                      <UploaderImageVideo getVideoImage={setVideoImage} name={name} url={ name && fileImageList[name]?.url }/>
                    )}
                    <IonIcon
                      icon={trashOutline}
                      style={{ margin: 'auto 0px auto auto' }}
                      onClick={() => removeFile(i)}
                    />
                  </IonItem>
                ))}
              </IonList>
              {(fileList?.length > 0 || Object.keys(fileImageList).length > 0) && (
                <Button onClick={uploadFile}>Привязать фаилы к посту</Button>
              )}
              {post?.postMedia?.length > 0 && (
                <ReorderFile
                  getVideoImage={setVideoImage}
                  handleReorder={handleReorder}
                  fileList={post?.postMedia}
                  fileImageList={fileImageList}
                  onFileDelete={onFileDelete}
                />
              )}
            </div>
          </IonAccordion>
          <IonAccordion value="publish">
            <IonItem slot="header" color="light">
              <IonLabel>Настройки публикации</IonLabel>
            </IonItem>
            <div className="ion-padding flex-column full-width align-center" slot="content">
              <FieldWithTitle
                key="tax-level-post"
                title={`Опубликовать пост - ${EStatus[post?.status || 'draft']}`}
              >
                <IonToggle
                  value={post?.status}
                  enableOnOffLabels={true}
                  onIonChange={function (e) {
                    const {
                      detail: { checked },
                    } = e;
                    const payload = checked
                      ? { publish: true, status: 'published' }
                      : { publish: false, status: 'draft' };
                    setPost((prev) => ({ ...prev, ...(payload as any) }));
                  }}
                  slot="end"
                  checked={post?.status === 'published'}
                ></IonToggle>
              </FieldWithTitle>
              <FieldWithTitle title={`Дата публикации ${convertDate(post?.publishAt)}`}>
                <DateSelect
                  onCancel={function () {
                    setPost((prev) => ({ ...prev, publishAt: '' }));
                  }}
                  onSet={function (date: string) {
                    setPost((prev) => ({ ...prev, publishAt: date }));
                  }}
                />
              </FieldWithTitle>
            </div>
          </IonAccordion>
          <IonAccordion value="push">
            <IonItem slot="header" color="light">
              <IonLabel>Пуш уведомление</IonLabel>
            </IonItem>
            <div className="ion-padding flex-column full-width align-center" slot="content">
              <FieldWithTitle key="title-push-post" title="Заголовок пуш уведомления">
                <IonInput
                  placeholder="Введите заголовок"
                  className={input}
                  value={post?.pushData?.title}
                  onInput={(e: ChangeEvent<HTMLIonInputElement>) => {
                    const value = e?.target?.value;
                    setPost((prev) => ({
                      ...prev,
                      pushData: { ...post?.pushData, title: `${value}` },
                    }));
                  }}
                ></IonInput>
              </FieldWithTitle>
              <FieldWithTitle key="description-push-post" title="Описание пуш уведомления">
                <IonInput
                  placeholder="Введите описание"
                  className={input}
                  value={post?.pushData?.body}
                  onInput={(e: ChangeEvent<HTMLIonInputElement>) => {
                    const value = e?.target?.value;
                    setPost((prev) => ({
                      ...prev,
                      pushData: { ...post?.pushData, body: `${value}` },
                    }));
                  }}
                ></IonInput>
              </FieldWithTitle>
              <FieldWithTitle key="title-media-post" title="Изображение пуш уведомления">
                <IonInput
                  placeholder="Введите url изображения"
                  className={input}
                  type="url"
                  value={post?.pushData?.body}
                  onInput={(e: ChangeEvent<HTMLIonInputElement>) => {
                    const value = e?.target?.value;
                    setPost((prev) => ({
                      ...prev,
                      pushData: { ...post?.pushData, image: `${value}` },
                    }));
                  }}
                ></IonInput>
              </FieldWithTitle>
            </div>
          </IonAccordion>
        </IonAccordionGroup>
      )}
      <Button onClick={post?.id ? updatePost : createPost}>
        {post?.id ? 'Сохранить изменения' : 'Создать черновик'}
      </Button>
      <IonLoading isOpen={loading} />
    </div>
  );
};

export default CreatePostContent;
