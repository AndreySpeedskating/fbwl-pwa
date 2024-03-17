/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable import/no-unresolved */
import { Decode, Encode } from 'arraybuffer-encoding/base64/url';
import LZString from 'lz-string';

import Logo from '../assets/image/FullLogo.png';
import { IFeed } from './api/interface';
import { FIVE, ONE, ONEH, TEN, TWO } from './constants';

export function bufferToBase64(buffer: ArrayBuffer): string {
  return Encode(buffer);
}
export function base64ToBuffer(base64: string): ArrayBuffer {
  return Decode(base64);
}

export const KEY_TYPE = 'public-key';
export const enc = new TextEncoder();
export const dec = new TextDecoder('utf-8');

export function idGenerator(): string {
  return Math.random().toString(20).substr(TWO, 8);
}

export async function getBiometryFlag(): Promise<boolean> {
  try {
    return (
      !!PublicKeyCredential &&
      (await PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable())
    );
  } catch (e) {
    return false;
  }
}

export const isoDateToLocaleDate = (value: string): string => {
  const [date] = value.split('T');

  return !!date ? date?.split('-')?.reverse()?.join('.') : '';
};

export const getCookie = (name: string): string | undefined => {
  const matches = new RegExp(
    `(?:^|; )${name.replace(/([$()*.?[{|}]\\\/\+\^])/g, '\\$1')}=([^;]*)`
  ).exec(document.cookie);
  return matches ? decodeURIComponent(matches[ONE]) : undefined;
};

export function splitArraytoChunks<T>(arr: T[] = [], chunkSize: number): T[][] {
  const cloned = JSON.parse(JSON.stringify(arr));
  const res = [];
  while (cloned?.length > 0) {
    const chunk = cloned?.splice(0, chunkSize);
    res.push(chunk);
  }
  return res;
}

export function declWord(value: number, words: string[]): string {
  value = Math.abs(value) % ONEH;
  const num = value % TEN;
  if (value > TEN && value < TEN * TWO) {
    return words[TWO];
  }
  if (num > ONE && num < FIVE) {
    return words[ONE];
  }
  if (num === ONE) {
    return words[0];
  }
  return words[TWO];
}

export const onKeyboardEnterPress = (e: any): void => {
  if (e?.key === 'Enter' && 'virtualKeyboard' in navigator) {
    (navigator as any).virtualKeyboard?.hide();
  }
};

export const subscribePushEvents = (event: any): void => {
  try {
    const notificationData = event?.data?.json();
    const { registration } = self as any;

    const options = {
      body: notificationData?.body,
      icon: notificationData?.icon || Logo,
      requireInteraction: true,
      ...(notificationData?.image && { image: notificationData?.image }),
      priority: 'max',
      android: {
        priority: 'max',
      },
    };

    return event.waitUntil(registration.showNotification(notificationData?.title || '', options));
  } catch (e) {
    console.log('push message error', e);
  }
};

const HOUR = 3600;

export function timeAgo(input: string): string | undefined {
  const date = new Date(input);
  const formatter = new Intl.RelativeTimeFormat('ru', {
    style: 'short',
  });
  const ranges: { [key: string]: number } = {
    years: HOUR * 24 * 365,
    months: HOUR * 24 * 30,
    weeks: HOUR * 24 * 7,
    days: HOUR * 24,
    hours: HOUR,
    minutes: 60,
    seconds: 1,
  };
  const secondsElapsed = (date.getTime() - Date.now()) / 1000;
  for (const key in ranges) {
    if (ranges[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / ranges[key];
      return formatter.format(Math.round(delta), key as any);
    }
  }
}

export const saveDataToLs = (token: string, key: string): void => {
  const payload = JSON.stringify(Array.from(enc.encode(token)));
  localStorage.setItem(key, payload);
};

export const getDataFromLs = (key: string): any => {
  const data = localStorage.getItem(key);
  if (data) {
    const parsedData = new Uint8Array(JSON.parse(data));
    return dec.decode(parsedData);
  }
};

export const getObjectFromLs = (key: string): any => {
  const data = localStorage.getItem(key);
  if (data) {
    const parsedData = new Uint8Array(JSON.parse(data));
    return dec.decode(parsedData)?.length ? JSON.parse(dec.decode(parsedData)) : '';
  }
};

export const serializePersistedData = (value: string): string =>
  JSON.stringify(Array.from(LZString.compressToUint8Array(`${value}`)));

export const deserializePersistedData = <T>(value: string): T =>
  JSON.parse(
    LZString.decompressFromUint8Array(
      Array.from(JSON.parse(value)) as unknown as Uint8Array
    ) as string
  );

export const returnFeedArray = (feeds: { [key: string]: IFeed }): IFeed[] =>
  Object.keys(feeds)?.map((key) => feeds[key]);
