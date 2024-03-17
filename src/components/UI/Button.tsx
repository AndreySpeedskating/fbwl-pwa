import { CSSProperties, FC, ReactElement, ReactNode } from 'react';

import { IonButton } from '@ionic/react';

import styles from './button.module.css';

type PropTypes = {
  children?: ReactElement | ReactElement[] | ReactNode;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
  style?: CSSProperties;
};

export const Button: FC<PropTypes> = ({ onClick, children, style, href, disabled }) => (
  <IonButton
    disabled={disabled}
    style={style}
    href={href}
    onClick={onClick}
    className={styles['button']}
  >
    {children}
  </IonButton>
);
