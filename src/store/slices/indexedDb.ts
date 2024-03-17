import localforage from 'localforage';

export const STORAGE = localforage.createInstance({
  driver: [localforage.INDEXEDDB],
  name: 'pwa-fbwl',
  version: 1.0,
  storeName: 'pwa-fbwl',
});
