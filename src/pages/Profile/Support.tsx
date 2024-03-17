import { lazy } from 'react';

import { Page, Suspense } from '../../components/UI';

const SupportContent = lazy(() => import('./content/SupportContent/SupportContent'));

const Support = (): JSX.Element => (
  <Page key="support" href="#/profile" title="Служба поддержки">
    <Suspense>
      <SupportContent />
    </Suspense>
  </Page>
);

export default Support;
