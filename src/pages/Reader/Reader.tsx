import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { ReactElement, useEffect, useRef, useState } from 'react';

import {
  IonAccordionGroup,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { BurgerIcon } from '../../components/Icons';
import { useFeedStore } from '../../store/slices/content.slice';
import { useUser } from '../../store/slices/user.slice';
import { loadAllSections, loadFeedListBySection } from '../../store/thunk/contentThunk';
import { full_width } from '../../theme/variables';
import { IFeed } from '../../utils/api/interface';
import { ONE } from '../../utils/constants';
import { useServiceHook } from '../../utils/hooks';
import useLoadFeedsAndComments from '../../utils/hooks/useLoadFeedsAndComments';
import PostContent from '../Post/PostContent';
import Section from './components/Section';
import styles from './styles.module.css';

// eslint-disable-next-line no-shadow
enum ESegmentType {
  BOOKMARK = 'bookmark',
  CHAPTER = 'chapter',
}

const getNumberSumm = (a?: number, b?: number): number => (a || 0) + (b || 0);

const Reader = (): ReactElement => {
  const { history } = useServiceHook();
  const { loadComments } = useLoadFeedsAndComments();
  const { setLastPost, lastReaderPost } = useUser();
  const { feedBySections, currentSection, sections } = useFeedStore((store) => ({
    feedBySections: store.feedBySections,
    currentSection: store.feedBySections[lastReaderPost?.sectionId || ''],
    sections: store.sections,
  }));
  const [selectedSegment, setSelectedSegment] = useState<ESegmentType>(ESegmentType.CHAPTER);
  const [isNavModalOpen, setIsNamvModalOpen] = useState(false);
  const [lastPostSectionId, setLastPostSectionId] = useState<string | undefined>(undefined);
  const accordionGroup = useRef<HTMLIonAccordionGroupElement | null>(null);
  const currentSectionIndex = sections?.findIndex(
    (section) => section?.id === lastReaderPost?.sectionId
  );
  const currentFeedIndex = currentSection?.feed?.findIndex((f) => f.id === lastReaderPost?.id);
  const number = getNumberSumm(sections?.[currentSectionIndex]?.startPostNumber, currentFeedIndex);
  const chapter = sections?.[currentSectionIndex]?.endPostNumber || 0;

  useEffect(() => {
    loadAllSections({
      cbSuccess: (data) => {
        const value = data?.[0]?.id;
        if (value) {
          loadFeedBySection(value, (feeds) => {
            !lastReaderPost?.id && setLastPostAndNavigate(value, feeds?.[0]?.id);
          });
        }
      },
    });
  }, []);

  const navigate = (path: string): void => history.push(path);

  const navModalHandler = (): void => {
    setIsNamvModalOpen((prev) => !prev);
  };

  const setLastPostAndNavigate = (targetSectionId: string, targetFeedid: string): void => {
    setLastPost({ sectionId: targetSectionId, id: targetFeedid });
    navigate(`/post-reader/${targetSectionId}/${targetFeedid}`);
  };

  const loadFeedBySection = (value: string, cb?: (data: any) => void): void => {
    const payload = {
      sectionId: value,
      cbSuccess: (data?: IFeed[]) => {
        if (data?.length) {
          cb && cb(data);
          const ids = data?.map(({ id: feedID }) => feedID);
          loadComments(ids);
        }
      },
    };
    loadFeedListBySection(payload);
  };

  const accordionGroupChange = (e: any, cb?: (data: any) => void): void => {
    e?.preventDefault && e?.preventDefault();
    e?.stopPropagation && e?.stopPropagation();
    const {
      detail: { value },
    } = e;
    if (value) {
      setLastPostSectionId(value);
      loadFeedBySection(value, cb);
    }
  };
  const onSegmentChangeHandler = (e: any): void => {
    const {
      detail: { value },
    } = e;
    setSelectedSegment(value);
  };

  const stepBackHandler = (): void => {
    const haveNavdetail = currentFeedIndex !== undefined && currentSectionIndex !== undefined;
    if (currentSectionIndex === 0 && currentFeedIndex === 0) {
      return;
    }
    if (haveNavdetail && currentFeedIndex !== 0) {
      const nextId = currentSection?.feed?.[currentFeedIndex - ONE]?.id;
      const currentSectionId = sections?.[currentSectionIndex]?.id;
      setLastPostAndNavigate(currentSectionId, nextId || '');
      return;
    }
    if (haveNavdetail && currentSectionIndex !== 0 && currentFeedIndex === 0) {
      const nextSection = sections?.[currentSectionIndex - ONE]?.id;
      if (!feedBySections[nextSection]) {
        accordionGroupChange({ detail: { value: nextSection } }, (data) => {
          setLastPostAndNavigate(nextSection, data[data?.length - ONE]?.id || '');
        });
        return;
      }
      const firstPostId =
        feedBySections?.[nextSection]?.feed?.[feedBySections[nextSection]?.feed?.length - ONE]?.id;
      setLastPostAndNavigate(nextSection, firstPostId);
    }
  };

  const stepForwardHandler = (): void => {
    const haveNavdetail = currentFeedIndex !== undefined && currentSectionIndex !== undefined;
    const lastFeedIndex = (currentSection?.feed?.length || ONE) - ONE;
    const lastSectionIndex = sections?.length - ONE;
    if (currentSectionIndex === lastSectionIndex && currentFeedIndex === lastFeedIndex) {
      return;
    }
    if (haveNavdetail && currentFeedIndex !== lastFeedIndex) {
      const nextId = currentSection?.feed?.[currentFeedIndex + ONE]?.id || '';
      const currentSectionId = sections?.[currentSectionIndex]?.id;
      setLastPostAndNavigate(currentSectionId, nextId);
      return;
    }
    if (
      haveNavdetail &&
      currentSectionIndex !== lastSectionIndex &&
      currentFeedIndex === lastFeedIndex
    ) {
      const nextSection = sections?.[currentSectionIndex + ONE]?.id;
      if (!feedBySections[nextSection]) {
        accordionGroupChange({ detail: { value: nextSection } }, (data) => {
          setLastPostAndNavigate(nextSection, data[0]?.id || '');
        });
        return;
      }
      const firstPostId = feedBySections?.[nextSection]?.feed?.[0]?.id;
      setLastPostAndNavigate(nextSection, firstPostId);
    }
  };

  return (
    <IonPage>
      <IonContent className={styles['content']} fullscreen>
        <PostContent isReader />
        <IonItem className={`${styles['navbar']}`} lines="none">
          <div
            key="nav-panel-reader"
            className={`flex-row flex-align-center flex-space-between ${full_width}`}
          >
            <IonButton onClick={navModalHandler} className="button-transparent">
              <BurgerIcon />
            </IonButton>
            <IonText>{`Глава ${number} из ${chapter}`}</IonText>
            <IonButton onClick={stepBackHandler} className={'button-transparent'}>
              <IonIcon color="dark" icon={chevronBackOutline} />
            </IonButton>
            <IonButton onClick={stepForwardHandler} className="button-transparent">
              <IonIcon color="dark" icon={chevronForwardOutline} />
            </IonButton>
            <div style={{ width: 24 }} />
          </div>
        </IonItem>
      </IonContent>
      <IonModal className={styles['reader-modal']} isOpen={isNavModalOpen}>
        <IonHeader>
          <IonToolbar className={styles['ion-header']}>
            <IonItem
              className={styles['sub-header']}
              onClick={navModalHandler}
              lines="none"
              detail={false}
            >
              <IonIcon
                style={{ margin: 'auto 0' }}
                slot="start"
                color="dark"
                icon={chevronBackOutline}
              />
              <IonTitle className={styles.title}>Серии</IonTitle>
            </IonItem>
          </IonToolbar>
        </IonHeader>
        <IonSegment
          className={styles['segment']}
          mode="md"
          onIonChange={onSegmentChangeHandler}
          value={selectedSegment}
        >
          <IonSegmentButton value={ESegmentType.CHAPTER}>
            <IonLabel className={styles['segment-label']}>Оглавление</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value={ESegmentType.BOOKMARK}>
            <IonLabel className={styles['segment-label']}>Закладки</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <IonContent className={styles['reader-modal']}>
          <IonAccordionGroup
            value={lastPostSectionId}
            onIonChange={accordionGroupChange}
            ref={accordionGroup}
          >
            {sections?.map((section) => (
              <Section
                isFavourite={selectedSegment === ESegmentType.BOOKMARK}
                onSectionClick={navModalHandler}
                key={`${section.id}`}
                section={section}
              />
            ))}
          </IonAccordionGroup>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Reader;
