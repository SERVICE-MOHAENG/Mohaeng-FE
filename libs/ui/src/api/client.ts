/**
 * API Client
 * axios 인스턴스를 생성하고 설정합니다.
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

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

// Private API Request Interceptor - Access Token 자동 추가
privateApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Private API Response Interceptor - 401 에러 처리 (토큰 갱신 등)
privateApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 에러이고 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // 토큰 갱신 API 호출 (추후 구현)
        // const response = await publicApi.post('/api/v1/auth/refresh', { refreshToken });
        // const { accessToken } = response.data;
        // localStorage.setItem('accessToken', accessToken);

        // 재시도
        // return privateApi(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 - 로그아웃 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default publicApi;
