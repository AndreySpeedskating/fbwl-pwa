import { FC } from 'react';

import { IonButton, IonRippleEffect } from '@ionic/react';

import { PARENT_START_ANSWER_CHUNK_ID, START_ANSWER_CHUNK_ID } from '../constants';
import styles from '../styles.module.css';

type PropTypes = {
  id: string;
  isParent?: boolean;
  reactions?: {
    like: number;
  };
};

const AnswerBlock: FC<PropTypes> = ({ id, reactions, isParent }) => (
  <div className="flex-row flex-align-center flex-space-between">
    <span className={styles.date}>{`Нравится: ${reactions?.like || 0}`}</span>
    <IonButton
      data-answer-id={id}
      id={`${isParent ? PARENT_START_ANSWER_CHUNK_ID : START_ANSWER_CHUNK_ID}-${id}`}
      className={`${styles['answer-button']} ${styles['write-button']} ion-activatable button-transparent font400`}
    >
      Ответить
      <IonRippleEffect></IonRippleEffect>
    </IonButton>
  </div>
);

export default AnswerBlock;
