import { ACCESS_TOKEN_STORAGE_KEY } from '../constants';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function saveAccessToken(accessToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
}
