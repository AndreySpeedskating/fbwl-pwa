import { FC, useLayoutEffect, useRef, useState } from 'react';

import { IonContent, IonModal } from '@ionic/react';

import { ONE } from '../../utils/constants';
import { Button } from '../UI';
import Header from './components/Header';
import Slider from './components/Slider';
import { CHROME_SLIDER, SAFARI_SLIDER } from './constants';
import { installPWA } from './helpers';
import styles from './styles.module.css';

const INIT_PX = 242;
const FULL_PX = 568;
const INIT_BP = INIT_PX / window.innerHeight;
const INIT_L_BP = FULL_PX / window.innerHeight;

type PropTypes = {
  isOpen: boolean;
  onWillDismiss(): void;
};

const { userAgent } = navigator;

const isSafari = userAgent?.indexOf('Safari') !== -ONE;

const InstallNotification: FC<PropTypes> = ({ isOpen, onWillDismiss }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const currentModalRef = useRef<HTMLIonModalElement>(null);
  const [makeInstallPwa, setMakeInstallPwa] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [breakPoints, setBreakpoints] = useState(INIT_BP);

  useLayoutEffect(() => {
    setMakeInstallPwa(!!(window as any)?.deferredInstallPrompt);
  }, []);

  const manualInstall = (): void => {
    if (currentModalRef?.current) {
      localStorage.setItem('already-install', 'true');
      currentModalRef.current.dismiss();
    }
  };

  const installPwa = async (): Promise<void> => {
    if (makeInstallPwa) {
      await installPWA((window as any)?.deferredInstallPrompt)
        .then(() => {
          manualInstall();
          return null;
        })
        .catch((e) => e);
    } else {
      setBreakpoints(INIT_L_BP);
      setShowSlider(true);
      currentModalRef?.current?.breakpoints?.pop();
      currentModalRef?.current?.breakpoints?.push(INIT_L_BP);
      currentModalRef?.current?.setCurrentBreakpoint(INIT_L_BP);
    }
  };

  return (
    <IonModal
      key={'install-modal'}
      ref={currentModalRef}
      isOpen={!!isOpen}
      initialBreakpoint={breakPoints}
      breakpoints={[0, breakPoints]}
      onIonBreakpointDidChange={(e) => {
        if (e.detail.breakpoint === 0) {
          onWillDismiss?.();
        }
      }}
      keyboardClose={true}
    >
      <IonContent className={`${styles['ion-content']} ion-padding`}>
        <div className="flex-column rlex-align-center" ref={contentRef}>
          <Header />
          {!makeInstallPwa && showSlider && (
            <Slider slides={isSafari ? SAFARI_SLIDER : CHROME_SLIDER} />
          )}
          {!showSlider && (
            <Button style={{ width: '90%' }} onClick={installPwa}>
              Добавить приложение
            </Button>
          )}
          {showSlider && (
            <Button style={{ width: '90%' }} onClick={manualInstall}>
              Понятно
            </Button>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default InstallNotification;
