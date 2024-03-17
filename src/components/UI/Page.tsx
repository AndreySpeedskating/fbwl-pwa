import { FC, ReactNode } from 'react';

import { IonContent, IonPage } from '@ionic/react';

import NavHeader from '../NavHeader';

type PropTypes = {
  children?: ReactNode | ReactNode[];
  href?: string;
  onNavClick?: () => void;
  title?: string;
};

export const Page: FC<PropTypes> = ({ href, children, title, onNavClick }) => (
  <IonPage>
    <NavHeader href={href} onBackClick={onNavClick} title={title || ''} />
    <IonContent>{children}</IonContent>
  </IonPage>
);
