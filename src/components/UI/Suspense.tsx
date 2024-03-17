import { FC, Suspense as ReactSuspense } from 'react';

import { IonLoading } from '@ionic/react';

import ErrorBoundary from '../ErrorBoundry';

type PropTypes = {
  children: any;
};

export const Suspense: FC<PropTypes> = ({ children }) => (
  <ErrorBoundary>
    <ReactSuspense fallback={<IonLoading id="SUSPENSE LOADING" isOpen={true} />}>
      {children}
    </ReactSuspense>
  </ErrorBoundary>
);
