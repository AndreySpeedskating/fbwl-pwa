import { FC, HtmlHTMLAttributes } from 'react';

import styles from './htmlcontainer.module.css';

type PropTypes = {
  html?: string;
};

export const HtmlContainer: FC<HtmlHTMLAttributes<HTMLSpanElement> & PropTypes> = ({
  id,
  html,
}) => (
  // eslint-disable-next-line react/no-danger
  <span id={id} dangerouslySetInnerHTML={{ __html: html || '' }} className={styles.text} />
);
