import { FC, useRef } from 'react';

import { IonButton, IonButtons, IonDatetime } from '@ionic/react';

import { Button } from '../../../../../components/UI';
import styles from '../styles.module.css';

type PropTypes = {
  onCancel: () => void;
  onSet: (value: string) => void;
};

const DateSelect: FC<PropTypes> = ({ onCancel, onSet }) => {
  const dateTimeRef = useRef<HTMLIonDatetimeElement>(null);
  const today = new Date(Date.now());
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

  return (
    <IonDatetime
      className={styles['date-picker']}
      ref={dateTimeRef}
      presentation="date-time"
      preferWheel={true}
      showDefaultButtons={true}
      min={today.toISOString()}
      doneText="Установить"
      cancelText="Сбросить"
      onIonCancel={onCancel}
      onIonChange={(e) => {
        const {
          detail: { value },
        } = e;
        onSet(`${value}`);
      }}
    >
      <IonButtons slot="buttons">
        <IonButton
          color="danger"
          onClick={async () => {
            await dateTimeRef?.current?.reset(today.toISOString());
            dateTimeRef?.current?.cancel();
          }}
        >
          Сбросить
        </IonButton>
        <Button
          onClick={() => {
            dateTimeRef?.current?.confirm();
          }}
        >
          Установить дату
        </Button>
      </IonButtons>
    </IonDatetime>
  );
};

export default DateSelect;
