import { chevronBackOutline } from 'ionicons/icons';
import { FC, ReactElement, ReactNode } from 'react';

import { IonHeader, IonIcon, IonItem, IonText, IonToolbar } from '@ionic/react';

import styles from './styles.module.css';

type PropTypes = {
  children?: ReactElement | ReactNode;
  href?: string;
  onBackClick?: () => void;
  onClick?: () => void;
  routerDirection?: 'back' | 'forward' | 'none' | 'root';
  title?: string;
  white?: boolean;
};

const NavHeader: FC<PropTypes> = ({
  href,
  title,
  children,
  onBackClick,
  onClick,
  routerDirection,
  white,
}) => (
  <IonHeader>
    <IonToolbar className={`${styles['ion-header']} ${white && styles['white']}`}>
      <IonItem
        className={styles['sub-header']}
        onClick={onClick}
        href={href}
        lines="none"
        detail={false}
        routerDirection={routerDirection}
      >
        <IonIcon
          onClick={onBackClick}
          style={{ margin: 0 }}
          slot="start"
          icon={chevronBackOutline}
        />
        {title && <IonText className={styles.title}>{title}</IonText>}
        {children}
      </IonItem>
    </IonToolbar>
  </IonHeader>
);

export default NavHeader;
