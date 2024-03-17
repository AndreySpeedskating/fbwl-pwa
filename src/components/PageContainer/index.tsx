import { FC, ReactNode, useEffect, useRef } from 'react';
import { useRouteMatch } from 'react-router';

import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';

import { setMoreFeeds } from '../../store/slices/content.slice';
import {
  ACTIVE_MENU,
  CLASS_ALIAS,
  CURRENT_BG,
  MENU_ITEM_ALIAS,
  useTabStore,
} from '../../store/slices/tab.slice';
import { full_width } from '../../theme/variables';
import { useServiceHook } from '../../utils/hooks';
import styles from './styles.module.css';

type PropTypes = {
  children: (HTMLIonContentElement & ReactNode)[] | any | (HTMLIonContentElement & ReactNode);
  onClick?: (e: any) => void;
  onPointerDown?(e: any): void;
  onPointerUp?(e: any): void;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  onTabChange?: (tab: keyof typeof MENU_ITEM_ALIAS) => void;
  scrollToTop?: boolean;
};

const ACTIVE_BUTTON_CLASS = 'button-active';

const PageContainer: FC<PropTypes> = ({ children, onTabChange, onClick, scrollToTop }) => {
  const { history } = useServiceHook();
  const { setActiveTab, activeTab } = useTabStore();
  const statusBarRef = useRef<(Element & { content: string }) | null>(
    document.querySelector('meta[name=theme-color]')
  );

  const contentRef = useRef<HTMLIonContentElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const {
    params: { tag: params },
  } = useRouteMatch() as any;

  useEffect(() => {
    if (scrollToTop && contentRef.current) {
      contentRef.current.scrollToTop();
    }
  }, [scrollToTop]);

  useEffect(() => {
    const page = pageRef.current;
    if (page) {
      page.addEventListener('touchstart', disableSwipe);
    }
    if (statusBarRef.current) {
      statusBarRef.current.content = CURRENT_BG[activeTab || 'Все'];
    }

    return () => {
      page?.removeEventListener('touchstart', disableSwipe);
    };
  }, [pageRef.current]);

  const changeTopMenuHandler = (
    e: React.MouseEvent<HTMLIonButtonElement> & {
      target: { ariaValueText: keyof typeof MENU_ITEM_ALIAS };
    }
  ): void => {
    const innerText = e.target?.ariaValueText;
    e?.stopPropagation();
    const needUpdate = innerText !== activeTab || params;
    if (needUpdate) {
      const body = document.getElementById('body');
      if (body) {
        body.setAttribute('class', CLASS_ALIAS[innerText]);
      }
      if (statusBarRef.current) {
        statusBarRef.current.content = CURRENT_BG[innerText];
      }
      onTabChange?.(innerText);
      setActiveTab(innerText);
      if (params) {
        history.replace({ search: '' });
      }
    }
  };

  function disableSwipe(e: any): void {
    const touchDetail = e?.['changedTouches']?.[0];
    if (touchDetail.pageX < 35) {
      e.preventDefault();
      e?.stopPropagation();
    }
  }

  return (
    <IonPage ref={pageRef} onClick={onClick} id="main-content" className={CLASS_ALIAS[activeTab]}>
      <IonContent
        ref={contentRef}
        scrollEvents={true}
        fullscreen
        id="ion-content-page"
        className={`${styles['main-container']}`}
      >
        <IonHeader className={styles.header}>
          <IonToolbar className={styles.toolbar}>
            <IonButtons
              slot="start"
              className={`${styles['toolbar-buttons']} flex-row flex-align-center ${full_width}`}
              id="toolbar-buttons"
            >
              {params && (
                <>
                  <IonButton
                    aria-valuetext={params}
                    onClick={changeTopMenuHandler}
                    className={`${styles['hash-button']} ${styles.button} ${styles[ACTIVE_BUTTON_CLASS]}`}
                  >
                    {`#${params}`}
                  </IonButton>
                  <IonButton
                    aria-valuetext="Сериал"
                    onClick={() => {
                      setMoreFeeds({ feeds: [], totalElements: 0, refresh: false, tag: 'tag' });
                      history.goBack();
                    }}
                    className={`${styles.button} ${
                      activeTab === ACTIVE_MENU.SERIAL && !params && styles[ACTIVE_BUTTON_CLASS]
                    } ${styles['close-button']}`}
                  >
                    <span aria-valuetext="Сериал" className={styles['close']}>
                      &times;
                    </span>
                  </IonButton>
                </>
              )}
              {!params && (
                <>
                  <IonButton
                    aria-valuetext="Сериал"
                    onClick={changeTopMenuHandler}
                    className={`${styles.button} ${
                      activeTab === ACTIVE_MENU.SERIAL && !params && styles[ACTIVE_BUTTON_CLASS]
                    }`}
                  >
                    Сериал
                  </IonButton>
                  <IonButton
                    aria-valuetext="backstage"
                    onClick={changeTopMenuHandler}
                    className={`${styles.button} ${
                      activeTab === ACTIVE_MENU.BACKSTAGE && styles[ACTIVE_BUTTON_CLASS]
                    }`}
                  >
                    backstage
                  </IonButton>
                  <IonButton
                    aria-valuetext="Видео"
                    onClick={changeTopMenuHandler}
                    className={`${styles.button} ${
                      activeTab === ACTIVE_MENU.VIDEO && styles[ACTIVE_BUTTON_CLASS]
                    }`}
                  >
                    Видео
                  </IonButton>
                  <IonButton
                    aria-valuetext="Герои"
                    onClick={changeTopMenuHandler}
                    className={`${styles.button} ${
                      activeTab === ACTIVE_MENU.HEROES && styles[ACTIVE_BUTTON_CLASS]
                    }`}
                  >
                    Герои
                  </IonButton>
                </>
              )}
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        {children}
      </IonContent>
    </IonPage>
  );
};

export default PageContainer;
