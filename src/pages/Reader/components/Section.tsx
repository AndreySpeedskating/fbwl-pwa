/* eslint-disable react/jsx-no-useless-fragment */
import { bookmark } from 'ionicons/icons';
import { FC, ReactElement, useRef } from 'react';

import { IonAccordion, IonIcon, IonItem, IonLabel, IonSpinner, IonText } from '@ionic/react';

import { useFeedStore } from '../../../store/slices/content.slice';
import { useServiceStore } from '../../../store/slices/service.slice';
import { useUser } from '../../../store/slices/user.slice';
import { ISection } from '../../../utils/api/interface';
import { ONE } from '../../../utils/constants';
import styles from './styles.module.css';

type PropTypes = {
  section: ISection;
  isFavourite?: boolean;
  onSectionClick?: () => void;
};

const getPostName = (a: number, b: number): number => a + b;

const Section: FC<PropTypes> = ({ section, onSectionClick, isFavourite }) => {
  const { setLastPost, lastReaderPost } = useUser();
  const accordRef = useRef<HTMLIonAccordionElement>(null);
  const { feedSection } = useFeedStore((store) => ({
    feedSection: store.feedBySections[section.id],
  }));
  const { favoritePosts, favorite } = useServiceStore();
  const markedPosts = favoritePosts
    ?.filter((post) => post?.sectionId === section?.id)
    ?.sort((a, b) => (a?.indexInSection > b?.indexInSection ? ONE : -ONE));

  const { name, id: sectionId, startPostNumber } = section;
  const activeAccord = sectionId === lastReaderPost?.sectionId;

  const renderContent = (): ReactElement[] | undefined =>
    !isFavourite
      ? feedSection?.feed?.map(({ id, indexInSection }) => (
          <div key={id} className="ion-padding" slot="content">
            <IonItem
              onClick={() => {
                setLastPost({ sectionId, id });
                onSectionClick?.();
              }}
              href={`#/post-reader/${sectionId}/${id}`}
              className={`${styles['feed-row']} ${
                lastReaderPost?.id === id ? styles['feed-active-row'] : ''
              }`}
            >
              <IonText className={styles['feed-inner']}>{`Серия ${getPostName(
                indexInSection,
                startPostNumber
              )}`}</IonText>
            </IonItem>
          </div>
        ))
      : markedPosts?.map(({ id, indexInSection }) =>
          favorite?.includes(id) ? (
            <div key={id} className="ion-padding" slot="content">
              <IonItem
                onClick={() => {
                  setLastPost({ sectionId, id });
                  onSectionClick?.();
                }}
                href={`#/post-reader/${sectionId}/${id}`}
                className={`${styles['feed-row']} ${
                  lastReaderPost?.id === id ? styles['feed-active-row'] : ''
                }`}
              >
                <IonIcon icon={bookmark} />
                <IonText className={styles['feed-inner']}>{`Серия ${getPostName(
                  indexInSection,
                  startPostNumber
                )}`}</IonText>
              </IonItem>
            </div>
          ) : (
            <></>
          )
        );

  if (isFavourite && markedPosts?.length === 0) {
    return <></>;
  }

  return (
    <IonAccordion ref={accordRef} value={sectionId}>
      <IonItem
        className={`${
          activeAccord ? styles['feed-active-accordion'] : styles['feed-default-accordion']
        }`}
        slot="header"
      >
        <IonLabel>{name}</IonLabel>
      </IonItem>
      {feedSection?.isLoading ? (
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          key={`${sectionId} loading`}
          className="ion-padding"
          slot="content"
        >
          <IonLabel>Загрузка серий...</IonLabel>
          <IonSpinner color="secondary" name="crescent"></IonSpinner>
        </div>
      ) : (
        renderContent()
      )}
    </IonAccordion>
  );
};

export default Section;
