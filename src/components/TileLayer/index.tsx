import { FC, ReactElement } from 'react';

import { IFeed } from '../../utils/api/interface';
import TileCard from '../TileCard';
import styles from './styles.module.css';

type PropTypes = {
  feeds: IFeed[];
  isBig?: number;
  page?: number;
};

function renderTileWithBig(index: number, feeds: IFeed[]): ReactElement {
  const [first, second, third] = feeds;
  if (index === 0) {
    return (
      <>
        {first && <TileCard key={first.id} feed={first} isBig={true} />}
        {(second || third) && (
          <div className={`${styles['row-with-big']} flex-column`}>
            {second && <TileCard key={second.id} feed={second} isBig={false} />}
            {third && <TileCard key={third.id} feed={third} isBig={false} />}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {(first || second) && (
        <div className={`${styles['row-with-big']} flex-column`}>
          {first && <TileCard key={first.id} feed={first} isBig={false} />}
          {second && <TileCard key={second.id} feed={second} isBig={false} />}
        </div>
      )}
      {third && <TileCard key={third.id} feed={third} isBig={true} />}
    </>
  );
}

const TileLayer: FC<PropTypes> = ({ feeds, isBig }) => (
  <div className={`${styles['content-row']} flex-row`}>
    {typeof isBig === 'number'
      ? renderTileWithBig(isBig, feeds)
      : feeds?.map((feed, i) => <TileCard key={feed.id} feed={feed} isBig={isBig === i} />)}
  </div>
);

export default TileLayer;
