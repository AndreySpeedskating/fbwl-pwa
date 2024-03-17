import axios from 'axios';

import { setRegistrationStatus } from '../../store/slices/auth.slice';

const CONTENT_TYPE = 'application/json';
const apiBaseUrl =
  window.location.host === 'app.fbwl.ru' ? 'https://auth.fbwl.ru' : 'https://auth-dev.fbwl.ru';
export const contentBaseUrl =
  window.location.host === 'app.fbwl.ru' ? 'https://api.fbwl.ru' : 'https://api-dev.fbwl.ru';

const UNAUTHTORIZED = 401;

export const authAPI = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': CONTENT_TYPE,
  },
});

export const contentApi = axios.create({
  baseURL: contentBaseUrl,
  withCredentials: true,
  headers: {
    Accept: CONTENT_TYPE,
    'Content-Type': CONTENT_TYPE,
    'Access-Control-Allow-Credentials': true,
  },
});

contentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === UNAUTHTORIZED) {
      setRegistrationStatus('false');
      localStorage.removeItem('-pt');
    }
    return error;
  }
);
