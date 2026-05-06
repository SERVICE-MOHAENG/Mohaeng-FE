/**
 * API Client
 * axios 인스턴스를 생성하고 설정합니다.
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { getAccessToken, redirectToLoginOnSessionExpired } from './authUtils';

const BASE_URL = import.meta.env.VITE_PROD_BASE_URL || 'https://api.mohaeng.kr';

/**
 * Public API 인스턴스 (인증 불필요)
 */
export const publicApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Private API 인스턴스 (인증 필요)
 */
export const privateApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const hasAuthorizationHeader = (
  config?: InternalAxiosRequestConfig,
): boolean => {
  const authorization =
    config?.headers?.Authorization ?? config?.headers?.authorization;

  return typeof authorization === 'string' && authorization.trim() !== '';
};

publicApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;

    if (error.response?.status === 401 && hasAuthorizationHeader(originalRequest)) {
      redirectToLoginOnSessionExpired();
    }

    return Promise.reject(error);
  },
);

// Private API Request Interceptor - Access Token 자동 추가
privateApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();
    if (accessToken && accessToken !== 'undefined' && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Private API Response Interceptor - 401 에러 처리
privateApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      redirectToLoginOnSessionExpired();
    }

    return Promise.reject(error);
  },
);

export default publicApi;
