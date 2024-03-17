import { FC } from 'react';

import { IonSelect, IonSelectOption } from '@ionic/react';

import styles from '../styles.module.css';

type PropTypes = {
  list: {
    label: string;
    value: string;
  }[];
  onSet: (value: string) => void;
  value: string;
};

const MenuSelect: FC<PropTypes> = ({ value, list, onSet }) => (
  <IonSelect
    className={styles['menu-select']}
    value={value}
    onIonChange={(e) => {
      onSet(e.detail.value);
    }}
    interface="popover"
    placeholder="Выбор категории"
  >
    {list?.map(({ value: itemValue, label }) => (
      <IonSelectOption key={itemValue} value={itemValue}>
        {label}
      </IonSelectOption>
    ))}
  </IonSelect>
);

export default MenuSelect;
