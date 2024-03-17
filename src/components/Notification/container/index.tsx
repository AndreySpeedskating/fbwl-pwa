import { FC, ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type PropTypes = {
  children: ReactNode | ReactNode[];
};

const NotificationWrapper: FC<PropTypes> = ({ children }) => {
  const [container] = useState<HTMLDivElement>(() => document.createElement('div'));
  useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  return ReactDOM.createPortal(children, container);
};

export default NotificationWrapper;
