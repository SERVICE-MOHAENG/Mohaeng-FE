/**
 * Auth API
 * 인증 관련 API 호출 함수들
 */

import { publicApi } from './client';
import { setAccessToken, setRefreshToken, clearTokens } from './authUtils';

/**
 * 로그인 요청 데이터 타입
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 로그인 응답 데이터 타입
 */
export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * 회원가입 요청 데이터 타입
 */
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

/**
 * 회원가입 응답 데이터 타입
 */
export interface SignupResponse {
  id: string;
  name: string;
  email: string;
  isActivate: boolean;
  createdAt: string;
}

/**
 * API 에러 응답 타입
 */
export interface ApiError {
  message: string;
  statusCode: number;
}

/**
 * 인증번호 발송 요청 데이터 타입
 */
export interface AuthCodeRequest {
  email: string;
}

/**
 * 인증번호 발송 응답 데이터 타입
 */
export interface AuthCodeResponse {
  message: string;
  statusCode: number;
}

/**
 * 인증번호 확인 요청 데이터 타입
 */
export interface AuthCodeCheckRequest {
  email: string;
  otp: string;
}

/**
 * 인증번호 확인 응답 데이터 타입
 */
export interface AuthCodeCheckResponse {
  message: string;
  statusCode: number;
}

/**
 * 로그인 API
 * POST /api/v1/auth/login
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await publicApi.post<LoginResponse>(
      '/api/v1/auth/login',
      data,
    );

    // 토큰 저장 (Cookie)
    if (response.data.success && response.data.data) {
      setAccessToken(response.data.data.accessToken);
      setRefreshToken(response.data.data.refreshToken);
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      // 서버 응답이 있는 경우
      throw {
        message: error.response.data?.message || '로그인에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      // 요청 설정 중 에러
      throw {
        message: '로그인 요청 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

/**
 * 회원가입 API
 * POST /api/v1/users
 */
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  try {
    const response = await publicApi.post<SignupResponse>(
      '/api/v1/users',
      data,
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message: error.response.data?.message || '회원가입에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '회원가입 요청 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

/**
 * 토큰 갱신 API
 * POST /api/v1/auth/refresh
 */
export const refreshToken = async (
  refreshTokenStr: string,
): Promise<LoginResponse> => {
  try {
    const response = await publicApi.post<LoginResponse>(
      '/api/v1/auth/refresh',
      {
        refreshToken: refreshTokenStr,
      },
    );

    // 새 토큰 저장
    if (response.data.success && response.data.data) {
      setAccessToken(response.data.data.accessToken);
      if (response.data.data.refreshToken) {
        setRefreshToken(response.data.data.refreshToken);
      }
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message: error.response.data?.message || '토큰 갱신에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else {
      throw {
        message: '토큰 갱신 요청 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

/**
 * 로그아웃
 * (클라이언트 사이드 로그아웃 - 토큰 삭제)
 */
export const logout = (): void => {
  clearTokens();
};

/**
 * OAuth 인증 코드를 토큰으로 교환
 * POST /api/v1/auth/oauth/exchange
 */
export const exchangeOAuthCode = async (
  code: string,
): Promise<LoginResponse> => {
  try {
    const response = await publicApi.post<LoginResponse>(
      '/api/v1/auth/oauth/exchange',
      {
        code,
      },
    );

    // 토큰 저장 (Cookie)
    if (response.data.success && response.data.data) {
      setAccessToken(response.data.data.accessToken);
      setRefreshToken(response.data.data.refreshToken);
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          'OAuth 인증 코드 교환에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else {
      throw {
        message: 'OAuth 인증 코드 교환 요청 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

export const signupAuthCode = async (
  data: AuthCodeRequest,
): Promise<AuthCodeResponse> => {
  console.log(data);
  try {
    const response = await publicApi.post<AuthCodeResponse>(
      '/api/v1/auth/email/otp/send',
      data,
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message || '인증번호 요청에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else {
      throw {
        message: '인증번호 요청 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

export const signupAuthCodeCheck = async (
  data: AuthCodeCheckRequest,
): Promise<AuthCodeCheckResponse> => {
  console.log(data);
  try {
    const response = await publicApi.post<AuthCodeCheckResponse>(
      '/api/v1/auth/email/otp/verify',
      data,
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message || '인증번호 확인에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else {
      throw {
        message: '인증번호 확인 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};
