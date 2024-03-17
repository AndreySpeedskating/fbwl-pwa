import { FC, useEffect, useRef } from 'react';

import { IonContent, IonModal } from '@ionic/react';

import SliderWithZoom from '../../../components/Slider/SliderWithZoom';
import { IFeed } from '../../../utils/api/interface';
import { ONE } from '../../../utils/constants';

type PropTypes = {
  data: IFeed | null;
  isOpen: boolean;
  onWillDismiss(): void;
  trigger?: string;
};

const ZoomImageModal: FC<PropTypes> = ({ isOpen, trigger, data, onWillDismiss }) => {
  const modalRef = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (modal) {
      modal.addEventListener('touchstart', disableSwipe);
    }
    return () => {
      modal?.removeEventListener('touchstart', disableSwipe);
    };
  }, [modalRef?.current]);

  function disableSwipe(e: any): void {
    e?.stopPropagation();
    const touchDetail = e?.['changedTouches']?.[0];
    if (touchDetail.pageX < 35 || (window?.innerWidth - touchDetail.pageX) < 35) {
      e.preventDefault();
      e?.stopPropagation();
    }
  }

  return (
    <IonModal
      ref={modalRef}
      isOpen={!!isOpen}
      trigger={trigger}
      initialBreakpoint={ONE}
      breakpoints={[0, ONE]}
      handleBehavior="cycle"
      onWillDismiss={onWillDismiss}
      className="ion-custorm-backdrop-modal"
    >
      <IonContent className={'ion-padding'}>
        <div className="flex-row full-height">
          <SliderWithZoom needPagination postMedia={data?.postMedia || []} initSlide={0} />
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ZoomImageModal;
