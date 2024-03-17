import { FC, useRef, useState } from 'react';

import { full_width } from '../../../theme/variables';
import { THREEH } from '../../../utils/constants';
import { ArrowIcon } from '../../Icons';
import { HtmlContainer } from '../../UI';
import rootStyles from '../styles.module.css';
import styles from './styles.module.css';

type PropTypes = {
  postId: string;
  text: string;
  isDraft?: boolean;
  isPost?: boolean;
};

const freeTextLength = 228;
const scrollCorrector = 180;

const Text: FC<PropTypes> = ({ text, postId, isDraft, isPost }) => {
  const [showAll, setShowAll] = useState(isPost || false);
  const containerRef = useRef<HTMLElement | null>(null);

  const showAllPostHandler = (): void => {
    if (!containerRef.current) {
      containerRef.current = document.getElementById(`post-text-${postId}`);
    }
    if (showAll && containerRef.current) {
      const content = document.querySelector('ion-content');
      content?.scrollToPoint(
        0,
        parseInt((containerRef.current as any)?.offsetParent?.offsetTop || 0, 10) + scrollCorrector,
        THREEH
      );
    }
    setShowAll(!showAll);
  };

  return (
    <div
      id={`post-text-${postId}`}
      className={`${styles['post-text-container']} ${
        showAll ? styles['post-text-full'] : ''
      } ${full_width}`}
    >
      <HtmlContainer html={text} />
      {(text?.length > freeTextLength || text?.includes('\n')) && !showAll && (
        <span
          className={`${styles.more} ${isDraft ? rootStyles.draft : ''} font400`}
          onClick={showAllPostHandler}
        >
          ...еще
        </span>
      )}
      {!isPost && (text?.length > freeTextLength || text?.includes('\n')) && showAll && (
        <span className={`${styles['rollup']} font400`} onClick={showAllPostHandler}>
          <ArrowIcon fill={'#808080'} strokeWidth={1} width={10} height={18} />
          Свернуть
        </span>
      )}
    </div>
  );
};

export default Text;
