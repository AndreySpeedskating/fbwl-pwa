/* eslint-disable no-alert */
import localforage from 'localforage';
import { Workbox } from 'workbox-window';

export const updateMessage = (language: string): string =>
  language === 'ru-RU'
    ? 'Доступна новая версия!. Нажмите Ок для обновления'
    : 'New app update is available!. Click OK to refresh';

const currentLanguage = navigator?.language;

export default function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('./service-worker.js');

    wb.addEventListener('installed', async (event) => {
      if (event.isUpdate && confirm(updateMessage(currentLanguage))) {
        const stor = await localforage.getItem('pwa-fbwl');
        console.log('pwa-fbwl', stor);
        await localforage
          .removeItem('feed-storage')
          .then(async (value) => {
            const feed = await localforage.getItem('feed-storage');
            console.log('remove feed storage', feed, value);
            return value;
          })
          .catch((reson) => {
            console.log('reson', reson);
            return reson;
          })
          .finally(() => {
            window.location.reload();
          });
      }
    });
    wb.register();
  }
}
