import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Access Token 저장 (기본 1시간)
 */
export const setAccessToken = (token: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: 1 / 24, // 1 hour
    secure: window.location.protocol === 'https:',
    sameSite: 'strict',
  });
};

/**
 * Refresh Token 저장 (기본 7일)
 */
export const setRefreshToken = (token: string) => {
  Cookies.set(REFRESH_TOKEN_KEY, token, {
    expires: 7, // 7 days
    secure: window.location.protocol === 'https:',
    sameSite: 'strict',
  });
};

/**
 * Access Token 가져오기
 */
export const getAccessToken = () => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

/**
 * 특정 쿠키 가져오기 (기본값: accessToken)
 */
export const getCookie = (name: string = ACCESS_TOKEN_KEY) => {
  return Cookies.get(name);
};

/**
 * Refresh Token 가져오기
 */
export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

/**
 * 모든 인증 토큰 삭제 (로그아웃용)
 */
export const clearTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};
