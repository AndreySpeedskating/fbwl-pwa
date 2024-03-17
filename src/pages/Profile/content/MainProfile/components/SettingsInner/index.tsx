import { FC, ReactNode } from 'react';

import { full_width } from '../../../../../../theme/variables';
import styles from './styles.module.css';

type PropTypes = {
  children: ReactNode | ReactNode[];
  onClick?: () => void;
};

const SETTINGS_ITEM_INNER = 'settings-item-inner';

const SettingsInner: FC<PropTypes> = ({ children, onClick }) => (
  <div
    onClick={onClick}
    className={`${styles[SETTINGS_ITEM_INNER]} flex-row ${full_width} flex-align-center`}
  >
    {children}
  </div>
);

export default SettingsInner;
