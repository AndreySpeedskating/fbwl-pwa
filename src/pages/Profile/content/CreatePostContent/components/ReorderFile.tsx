import { trashOutline } from 'ionicons/icons';
import { ChangeEvent, FC } from 'react';

import {
  IonIcon,
  IonItem,
  IonReorder,
  IonReorderGroup,
  IonText,
  ItemReorderEventDetail,
} from '@ionic/react';

import { ONE } from '../../../../../utils/constants';
import { IMedia } from '../constants';
import styles from '../styles.module.css';
import { UploaderImageVideo } from './index';

const { slide, reorder } = styles;

type PropTypes = {
  fileImageList: {[key: string]: {file: File, url: string}};
  getVideoImage: (event: ChangeEvent<HTMLInputElement>, name?: string) => void;
  handleReorder: (event: CustomEvent<ItemReorderEventDetail>) => void;
  fileList?: IMedia [];
  onFileDelete?: (index: number) => void;
};

const ReorderFile: FC<PropTypes> = ({ fileList, handleReorder, onFileDelete,
                                      getVideoImage, fileImageList }) => (
  <IonReorderGroup
    className={fileList?.length ? reorder : ''}
    disabled={false}
    onIonItemReorder={handleReorder}
  >
    {!!fileList &&
      fileList?.map(({ url, mime, thumbnail }, i) => (
        <IonItem className={styles['reorder-item']} key={url}>
          <IonReorder>
            <div className="flex-row flex-align-center">
              {mime?.includes('video') ? (
                <video width={128} height={128} muted playsInline preload="metadata">
                  <source src={`${url}#t=0,5`} type={mime} />
                </video>
              ) : (
                <img style={{ objectFit: 'contain' }} width={128} height={128} src={url} alt="" />
              )}
              <IonText className={slide}>{`Слайд ${i + ONE}`}</IonText>
            </div>
          </IonReorder>
          {mime?.includes('video') && (
            <UploaderImageVideo getVideoImage={getVideoImage} name={url} url={fileImageList[url]?.url || thumbnail} />
            )}
          <IonIcon
            style={{ margin: 'auto 12px auto auto' }}
            icon={trashOutline}
            onClick={() => {
              onFileDelete?.(i);
            }}
          />
        </IonItem>
      ))}
  </IonReorderGroup>
);

export default ReorderFile;
