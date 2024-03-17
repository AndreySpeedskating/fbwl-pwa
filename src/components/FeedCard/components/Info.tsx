import { ReactElement } from 'react';

import { timeAgo } from '../../../utils/helpers';
import styles from './styles.module.css';

type PropTypes = {
  publishAt?: string | null;
  publishedAt?: string;
};

const Info = ({ publishedAt, publishAt }: PropTypes): ReactElement => {
  const publishTime = publishedAt ? publishedAt : publishAt || null;
  return (
    <div className={`${styles['info-container']} flex-row full-width`}>
      <span className={`${styles['author-title']}`}>forbarbie_withlove</span>
      {publishTime && (
        <span className={`${styles['author-title']} font400`}>{timeAgo(publishTime)}</span>
      )}
    </div>
  );
};

export default Info;
