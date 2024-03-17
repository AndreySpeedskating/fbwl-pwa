import { ReactElement, useEffect, useRef, useState } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';

import { IonContent, IonImg, IonPage, IonText } from '@ionic/react';

import Logo from '../../assets/image/logo.png';
import Form from './components/Form';
import styles from './styles.module.css';

const Registration = ({
  from,
}: {
  from: RouteComponentProps<Record<string, never>, StaticContext, unknown>;
}): ReactElement => {
  const contentRef = useRef<HTMLIonContentElement>(null);
  const statusBarRef = useRef<(Element & { content: string }) | null>(
    document.querySelector('meta[name=theme-color]')
  );
  const [historyUrl, setHistoryUrl] = useState<string>();

  useEffect(() => {
    if (statusBarRef.current) {
      statusBarRef.current.content = '#fff1fd';
    }
    if (contentRef.current) {
      contentRef.current.addEventListener('touchstart', disableSwipe);
    }

    return () => {
      contentRef.current?.removeEventListener('touchstart', disableSwipe);
      setHistoryUrl(undefined);
    };
  }, [contentRef.current]);

  useEffect(() => {
    if (from?.location.pathname !== '/registration') {
      setHistoryUrl(from?.location.pathname);
    }
  }, [from?.location.pathname]);

  function disableSwipe(e: any): void {
    const touchDetail = e?.['changedTouches']?.[0];
    if (touchDetail.pageX < 35) {
      e.preventDefault();
    }
  }

  return (
    <IonPage ref={contentRef}>
      <IonContent className={`${styles['container']}`} fullscreen>
        <div className={styles['logo-container']}>
          <IonImg src={Logo} />
        </div>
        <div className={`${styles['form']} flex-column flex-align-center`}>
          <IonText>
            <span className={styles['title']}>Авторизация</span>
          </IonText>
          <Form historyUrl={historyUrl} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Registration;
