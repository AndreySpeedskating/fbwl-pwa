import Logo from '../../../assets/image/FullLogo.png';
import { contentApi } from '../../../utils/api/config.api';
import { registerPushSubscribtion } from '../../../utils/api/subscribe.api';
import { base64ToBuffer } from '../../../utils/helpers';

export async function getNotifyPermission(): Promise<PushSubscription | null> {
  if ('Notification' in window && 'ServiceWorker' in window) {
    console.log('CASE');
    try {
      const permission = await Notification.requestPermission();
      console.log('permission', permission);
      if (permission === 'granted') {
        const publicKey = await contentApi
          .get('push/publicKey')
          .then(({ data }) => base64ToBuffer(data));
        console.log('publicKey', publicKey);
        const registration = await navigator.serviceWorker.ready;
        console.log('registration', registration);
        const alreadySubscribe = await registration.pushManager.getSubscription();
        console.log('alreadySubscribe', alreadySubscribe);
        if (!alreadySubscribe) {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: new Uint8Array(publicKey),
          });
          await registerPushSubscribtion(subscription?.toJSON());
          registration.showNotification('Поздравляем!', {
            body: 'Вы подписаны на обновления',
            icon: Logo,
          });
          return subscription;
        }
        return null;
      }
      return null;
    } catch (error: any) {
      console.log('error', error?.response);
      throw new Error(error?.message);
    }
  }
  return null;
}

export async function unsubscribeNotifyPermission(): Promise<boolean | null> {
  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const alreadySubscribe = await registration.pushManager.getSubscription();
        if (!alreadySubscribe) {
          return null;
        }
        await alreadySubscribe.unsubscribe();
        return true;
      }
      return false;
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }
  return null;
}
