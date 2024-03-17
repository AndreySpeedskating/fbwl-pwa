import { useEffect, useRef, useState } from 'react';

import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import NavHeader from '../../components/NavHeader';
import { Button, HtmlContainer } from '../../components/UI';
import { useNotify } from '../../store/slices/notify.slice';
import { getInitialSubscribeData, setAutoprolongation } from '../../store/thunk/subscribeThunk';
import { getMySubscribeStatus } from '../../store/thunk/userThunk';
import {
  ion_button_background,
  ion_color_white,
  ion_text_primary_black,
} from '../../theme/variables';
import { IInitSubscribe } from '../../utils/api/interface';
import { useServiceHook } from '../../utils/hooks';
import useLoadFeedsAndComments from '../../utils/hooks/useLoadFeedsAndComments';
import { OFERT_TEXT } from './constants';
import styles from './styles.module.css';

const NAVIGATION_DELAY = 500;

const Subscribe = (): JSX.Element => {
  const { history } = useServiceHook();
  const { loadFeeds } = useLoadFeedsAndComments();
  const { setNotifyInfo } = useNotify();
  const [subscribeData, setSubscribeData] = useState<IInitSubscribe | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [acceptOfert, setAcceptOfert] = useState(true);
  const [showOfert, setShowOfert] = useState(false);
  const alreadyInitWidget = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    getInitialSubscribeData({ cbSuccess: (data) => setSubscribeData(data) });
    return () => {
      if (alreadyInitWidget.current) {
        alreadyInitWidget.current.destroy();
      }
    };
  }, []);

  const onModalDissMiss = async (): Promise<void> => {
    await modalRef?.current?.dismiss()?.then(() => {
      history.replace('/profile');
      return true;
    });
  };

  const initWidget = (): void => {
    if (acceptOfert) {
      setIsOpen(false);
      if (containerRef.current && subscribeData && !alreadyInitWidget.current) {
        const checkout = new (window as any).YooMoneyCheckoutWidget({
          confirmation_token: subscribeData?.confirmation_token, // Токен, который перед проведением оплаты нужно получить от ЮKassa
          return_url: subscribeData?.return_url, // Ссылка на страницу завершения оплаты, это может быть любая ваша страница
          customization: {
            colors: {
              background: '#f2f3f5',
              border: ion_text_primary_black,
              control_primary_content: ion_color_white,
              control_primary: ion_button_background,
              control_secondary: '#c2c9d1',
            },
          },
          error_callback() {
            setNotifyInfo({
              message: 'Ошибка инициализации платежного виджета',
              type: 'error',
              show: true,
            });
          },
        });
        checkout.on('complete', () => {
          setNotifyInfo({
            message: 'Платеж успешно завершен',
            type: 'success',
            show: true,
          });
          setAutoprolongation({
            cbSuccess: () => {
              getMySubscribeStatus({});
            },
          });
          loadFeeds({ menuItem: 'serial', refresh: true });
          setTimeout(() => {
            history.replace('/profile');
          }, NAVIGATION_DELAY);
        });
        checkout.render('payment-container');
        alreadyInitWidget.current = checkout;
      }
    }
  };

  const showOfertHandler = (): void => {
    setShowOfert(true);
  };

  const closeOfert = (): void => {
    setShowOfert(false);
  };

  return (
    <IonPage>
      <NavHeader onClick={onModalDissMiss} title="Подписка" />
      <IonContent fullscreen>
        <div ref={containerRef} id="payment-container"></div>
      </IonContent>
      <IonModal ref={modalRef} backdropDismiss={false} isOpen={isOpen}>
        <IonHeader>
          <IonToolbar>
            <IonTitle className={styles.title}>Условия Оплаты</IonTitle>
            <IonButtons slot="end">
              <IonButton className={styles['subscribe-modal-button']} onClick={onModalDissMiss}>
                Отмена
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className={`${styles['subscripe-content-modal']} flex-row`}>
          {showOfert ? (
            <>
              <HtmlContainer html={OFERT_TEXT} />
              <div style={{ justifyContent: 'center', margin: '16px 0 0' }} className="flex-row">
                <Button onClick={closeOfert}>Понятно</Button>
              </div>
            </>
          ) : (
            <div className={`${styles['subscribe-ofert-container']} flex-row flex-center`}>
              <div style={{ width: '80%' }} className={`${styles['ofert-inner']} flex-column`}>
                <HtmlContainer
                  html={`За 349р/месяц Вы получите доступ к платному контенту forbarbie_withlove: </br>
                  - новые сюжеты сериала</br>
                  - бекстейджи съёмок, распаковки</br>
                  - процесс строительства диорам`}
                />
                <Button onClick={initWidget} disabled={!acceptOfert}>
                  Продолжить
                </Button>
                <div>
                  <IonCheckbox
                    className={styles['checkbox']}
                    checked={acceptOfert}
                    onIonChange={(e: any) => {
                      const {
                        detail: { checked },
                      } = e;
                      setAcceptOfert(checked);
                    }}
                  />
                  <IonText>
                    Нажимая продолжить, я принимаю условия оплаты и ее автоматического продления,
                    указанные в{' '}
                    <IonButton
                      onClick={showOfertHandler}
                      className={`${styles['ofert-button']} button-transparent`}
                    >
                      оферте
                    </IonButton>
                  </IonText>
                </div>
              </div>
            </div>
          )}
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Subscribe;
