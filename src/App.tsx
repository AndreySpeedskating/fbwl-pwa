import { ReactElement } from 'react';

import { IonApp, setupIonicReact } from '@ionic/react';

import Routes from './pages/routes';

import '@ionic/react/css/core.css';

import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';

/* Theme variables */
import './theme/variables.css';
import './theme/styles.css';

setupIonicReact({
  swipeBackEnabled: false,
  animated: true,
});

const App = (): ReactElement => (
  <IonApp>
    <Routes />
  </IonApp>
);

export default App;
