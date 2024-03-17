/* eslint-disable react/jsx-no-useless-fragment */
import { FC, ReactElement, lazy, useEffect, useRef, useState } from 'react';
import { Redirect, Route } from 'react-router';

import { IonAvatar, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';

import DefaultAvatar from '../assets/image/default.png';
import { FeedIcon, HomeIcon, ReaderIcon } from '../components/Icons';
import InstallNotification from '../components/InstallNotification';
import Notifications from '../components/Notification';
import PushNotification from '../components/PushNotification';
import { Suspense } from '../components/UI';
import { resetNotify, useNotify } from '../store/slices/notify.slice';
import { useUser } from '../store/slices/user.slice';
import { DOUBLE_CLICK_THRESHOLD, ONE } from '../utils/constants';
import { getDataFromLs, getObjectFromLs } from '../utils/helpers';
import { Notification, Profile, ProfileView, Subscribe, SubscribeInfo, UserInfo } from './Profile';

const Main = lazy(() => import('./Main/Main'));
const Tile = lazy(() => import('./Tile/Tile'));
const Reader = lazy(() => import('./Reader/Reader'));
const CreatePost = lazy(() => import('./Profile/CreatePost'));
const Support = lazy(() => import('./Profile/Support'));
const Registration = lazy(() => import('./Registration/Registration'));
const Post = lazy(() => import('./Post/Post'));
const Authtor = lazy(() => import('./Authtor/Authtor'));

const ROUTER_MAP: {
  component: () => ReactElement;
  path: string;
}[] = [
  {
    path: '/main',
    component: () => <Main />,
  },
  {
    path: '/tile',
    component: () => <Tile />,
  },
  {
    path: '/tile/:tag',
    component: () => <Tile />,
  },
  {
    path: '/authtor',
    component: () => <Authtor />,
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/support',
    component: () => <Support />,
  },
  {
    path: '/customization-user',
    component: ProfileView,
  },
  {
    path: '/subscribe',
    component: Subscribe,
  },
  {
    path: '/subscribtion-info',
    component: SubscribeInfo,
  },
  {
    path: '/notification',
    component: Notification,
  },
  {
    path: '/user/:id',
    component: UserInfo,
  },
  {
    path: '/post/:id',
    component: () => <Post />,
  },
  {
    path: '/post-reader/:sectionId/:id',
    component: () => <Reader />,
  },
];

const ALREADY_ENTER = 'already-enter';

const Routes: FC = () => {
  const lastPost = useUser((state) => state.lastReaderPost);
  const { type, message, show } = useNotify((state) => state);
  const alreadyInstall = JSON.parse(localStorage.getItem('already-install') || 'false');
  const alreadyEnter = JSON.parse(localStorage.getItem(ALREADY_ENTER) || 'false');
  const [needShowInstall, setNeedShowInstall] = useState(false);
  const [pushSubscribtionShow, setPushSubscribtionShow] = useState(false);
  const [user, setUser] = useState<any>(getObjectFromLs('-uio'));
  const [registrationStatus, setRegistrationStatus] = useState(getDataFromLs('-rsv'));
  const count = useRef(0);

  const setInstallModal = (): void => {
    setNeedShowInstall(!alreadyInstall && !(window as any)?.navigator?.standalone);
  };

  const makePushAdd = async (): Promise<void> => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      const alreadySubscribe = await registration.pushManager.getSubscription();
      const alreadyShowPush = localStorage.getItem('alreadyShowPush');
      if (!alreadySubscribe && registration && registrationStatus && !alreadyShowPush) {
        setPushSubscribtionShow(true);
        localStorage.setItem('alreadyShowPush', 'true');
      }
    }
  };

  useEffect(() => {
    const update = (): void => {
      setUser(getObjectFromLs('-uio'));
      setRegistrationStatus(getDataFromLs('-rsv'));
    };
    window.addEventListener('storage', update);
    (window as any).deferredInstallPrompt = null;
    function saveBeforeInstallPromptEvent(event: any): void {
      (window as any).deferredInstallPrompt = event;
      setInstallModal();
      event.preventDefault();
    }
    if ((window as any).deferredInstallPrompt === null) {
      if (!(window as any)?.BeforeInstallPromptEvent) {
        setInstallModal();
      }
      window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);
    }
    !alreadyEnter ? localStorage.setItem(ALREADY_ENTER, 'true') : makePushAdd();
    return () => {
      window.removeEventListener('storage', update);
    };
  }, []);

  const clickHandler = (e: any): void => {
    console.log(e);
    count.current = count.current + ONE;
    const t = setTimeout(() => {
      if (count.current > ONE) {
        self.postMessage('scroll-top');
      }
      count.current = 0;
      clearTimeout(t);
    }, DOUBLE_CLICK_THRESHOLD);
    if (count.current > ONE) {
      clearTimeout(t);
    }
  };

  return (
    <IonReactHashRouter>
      {!registrationStatus || registrationStatus === 'false' ? (
        <IonRouterOutlet>
          <Route
            key="/registration"
            exact
            path="/registration"
            render={(props) => (
              <Suspense>
                <Registration from={props} />
              </Suspense>
            )}
          />
          <Redirect
            to={{
              pathname: '/registration',
              state: { from: location },
            }}
          />
        </IonRouterOutlet>
      ) : (
        <IonTabs>
          <IonRouterOutlet animated={true}>
            <Suspense>
              {ROUTER_MAP.map(({ component, path }) => (
                <Route key={path} exact={true} path={path} component={component} />
              ))}
              {user?.role?.includes('ADMIN') ? (
                <Route component={CreatePost} key="/profile/create" exact={true} path="/create" />
              ) : (
                <></>
              )}
              <Redirect from="*" to={{ pathname: '/main' }} />
            </Suspense>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton onClick={clickHandler} key="main" tab="main" href="/main">
              <HomeIcon width={40} />
            </IonTabButton>
            <IonTabButton onClick={clickHandler} key="tile" tab="/tile" href="/tile">
              <FeedIcon width={40} />
            </IonTabButton>
            <IonTabButton
              key="post-reader"
              tab="post-reader"
              href={`/post-reader/${lastPost?.sectionId}/${lastPost?.id}`}
            >
              <ReaderIcon width={40} />
            </IonTabButton>
            <IonTabButton key="profile" tab="profile" href="/profile">
              <IonAvatar style={{ width: 32, height: 32 }}>
                <img src={user?.profilePictureURL || DefaultAvatar} alt="avatar" />
              </IonAvatar>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      )}
      <Notifications autoHide type={type} show={show} closeButton={true} onClose={resetNotify}>
        {message}
      </Notifications>
      {needShowInstall && (
        <InstallNotification
          isOpen={!alreadyInstall && needShowInstall}
          onWillDismiss={() => {
            setNeedShowInstall(false);
          }}
        />
      )}
      {pushSubscribtionShow && (
        <PushNotification
          isOpen={pushSubscribtionShow}
          onWillDismiss={() => {
            setPushSubscribtionShow(false);
          }}
        />
      )}
    </IonReactHashRouter>
  );
};

export default Routes;
