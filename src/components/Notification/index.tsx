import { FC, ReactNode, useEffect, useRef, useState } from 'react';

import { ion_input_error, ion_text_primary_black } from '../../theme/variables';
import { FIVEH, ONEH } from '../../utils/constants';
import { CloseIcon } from '../Icons';
import NotificationWrapper from './container';
import styles from './styles.module.css';

const showTime = 6000;

type PropTypes = {
  autoHide: boolean;
  children: ReactNode | ReactNode[];
  closeButton: boolean;
  onClose: () => void;
  show: boolean;
  type: 'error' | 'info' | 'success';
};

const colorSchema = {
  error: ion_input_error,
  success: '#54bf5f',
  info: ion_text_primary_black,
};

const Notifications: FC<PropTypes> = ({ show, autoHide, type, children, closeButton, onClose }) => {
  const notifyContainer = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const closeNotify = (): void => {
    if (notifyContainer.current) {
      notifyContainer.current?.classList?.remove(styles.open);
    }
    setTimeout(() => {
      setIsOpen(false);
      onClose?.();
    }, FIVEH);
  };

  useEffect(() => {
    if (show && !isOpen) {
      setIsOpen(true);
      setTimeout(() => {
        notifyContainer.current?.classList?.add(styles.open);
      }, ONEH);
    } else if (!show && isOpen) {
      closeNotify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, children]);

  useEffect(() => {
    if (isOpen && autoHide) {
      setTimeout(() => {
        closeNotify();
      }, showTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, children]);

  useEffect(
    () => () => {
      onClose?.();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return isOpen ? (
    <NotificationWrapper>
      <div ref={notifyContainer} className={`${styles['notification-container']} ${styles[type]}`}>
        {closeButton && (
          <div onClick={closeNotify} className={styles.closeButton}>
            <CloseIcon fill={colorSchema[type]} />
          </div>
        )}
        {children || 'Очень важное сообщение'}
      </div>
    </NotificationWrapper>
  ) : null;
};

export default Notifications;
