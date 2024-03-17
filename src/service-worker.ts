/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

import { subscribePushEvents } from './utils/helpers';

const DAYS = 30;

export const GOOD_STATUS = 200;

export const CACHE_LIFE_TIME = DAYS * 24 * 60 * 60;

clientsClaim();

(self as any).skipWaiting();

precacheAndRoute([...(self as any).__WB_MANIFEST]);

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, GOOD_STATUS],
      }),
      new ExpirationPlugin({
        maxEntries: 600,
        maxAgeSeconds: CACHE_LIFE_TIME, // 30 Days
      }),
    ],
  })
);

registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

self.addEventListener('push', (event: any) => {
  if (!(self.Notification && self.Notification?.permission === 'granted')) {
    return;
  }
  console.log('[Service Worker] Push Received.');
  subscribePushEvents(event);
});

self.addEventListener('notificationclick', (event: any) => {
  const notificationData = event?.data?.json();
  const url = notificationData?.url
    ? `${self.location?.origin}/#/${notificationData?.url}`
    : `${self.location?.origin}/#/main`;
  const clients = event?.currentTarget?.clients;
  event.notification.close();
  event.waitUntil(
    clients?.matchAll({ type: 'window' }).then((clientsArr: any) => {
      const hadWindowToFocus = clientsArr.some((windowClient: { focus: () => void; url: any }) =>
        windowClient?.url === url ? (windowClient?.focus(), true) : false
      );
      if (!hadWindowToFocus) {
        clients
          ?.openWindow(url)
          ?.then((windowClient: { focus: () => any }) =>
            windowClient ? windowClient?.focus() : null
          );
      }
    })
  );
});
