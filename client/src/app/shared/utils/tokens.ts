import { ACCESS_TOKEN_STORAGE_KEY } from '../constants';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function saveAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
}
