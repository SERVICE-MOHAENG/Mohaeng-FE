import { ApiError } from './common.type';
import { publicApi, privateApi } from './client';
import {
  setAccessToken,
  setRefreshToken,
  clearTokens,
  getAccessToken,
} from './authUtils';

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  const token = getAccessToken();
  return token && token !== 'undefined'
    ? { Authorization: `Bearer ${token}` }
    : {};
};

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
 * 메인페이지 유저 정보 응답 데이터 타입
 */
export interface UserResponse {
  profile: {
    id: string;
    name: string;
    email: string;
    profileImage: {};
  };
  stats: {
    createdRoadmaps: number;
    visitedCountries: number;
    writtenBlogs: number;
    likedRegions: number;
  };
}

/**
 * 마이페이지 내 여행 일정 조회 응답 데이터 타입
 */
export interface MyRoadmapsResponse {
  data: {
    page: 0;
    limit: 0;
    total: 0;
    totalPages: 0;
    items: [
      {
        id: 'string';
        title: 'string';
        imageUrl: {};
        days: 0;
        nights: 0;
        hashTags: ['string'];
        likeCount: 0;
        isLiked: true;
      },
    ];
  };
}

/**
 * 마이페이지 여행 기록 조회 응답 데이터 타입
 */
export interface MyTravelLogsResponse {
  data: {
    page: 0;
    limit: 0;
    total: 0;
    totalPages: 0;
    items: [
      {
        id: 'string';
        title: 'string';
        imageUrl: {};
        likeCount: 0;
        isLiked: true;
        createdAt: '2026-03-16T03:14:05.247Z';
      },
    ];
  };
}

/**
 * 마이페이지 좋아요한 여행지 조회 응답 데이터 타입
 */
export interface MyRegionsResponse {
  data: {
    page: 0;
    limit: 0;
    total: 0;
    totalPages: 0;
    items: [
      {
        regionId: 'string';
        regionName: 'string';
        imageUrl: {};
        description: {};
        likeCount: 0;
        isLiked: true;
      },
    ];
  };
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
      '/api/v1/auth/signup',
      data,
    );
    if (!response.data.isActivate) {
      console.log(
        '회원가입은 성공했으나, 계정이 활성화되지 않았습니다 (isActivate: false)',
      );
    }
    console.log('회원가입 응답 데이터:', response.data.isActivate);
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

//**
// 회원 탈퇴
// DELETE /api/v1/users/me
// */
export const withdraw = async (): Promise<void> => {
  try {
    await privateApi.delete('/api/v1/users/me', {
      headers: getAuthHeaders(),
    });
  } catch (error: any) {
    if (error.response) {
      throw {
        message: error.response.data?.message || '회원 탈퇴에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '회원 탈퇴 요청 중 오류가 발생했습니다.',
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

/**POST
/api/v1/auth/email/otp/send
이메일 인증코드 발급
 */
export const signupAuthCode = async (
  data: AuthCodeRequest,
): Promise<AuthCodeResponse> => {
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

/**POST
/api/v1/auth/email/otp/verify
인증코드 검증
 */
export const signupAuthCodeCheck = async (
  data: AuthCodeCheckRequest,
): Promise<AuthCodeCheckResponse> => {
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

/**
GET
/api/v1/users/me
마이페이지 상단 요약 정보 조회
 */
export const getMainPageUser = async (): Promise<UserResponse> => {
  try {
    const response = await privateApi.get<UserResponse>('/api/v1/users/me', {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          '메인페이지 유저 정보 조회에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else {
      throw {
        message: '메인페이지 유저 정보 조회 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

/**
 GET
/api/v1/users/me/roadmaps
마이페이지 내 여행 일정 조회
 */
export const getMyRoadmaps = async (
  page: number,
  limit: number,
): Promise<MyRoadmapsResponse> => {
  const params = {
    page,
    limit,
  };
  try {
    const response = await privateApi.get<MyRoadmapsResponse>(
      '/api/v1/users/me/roadmaps',
      {
        headers: getAuthHeaders(),
        params,
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          '내가 작성한 로드맵 목록 조회에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else {
      throw {
        message: '내가 작성한 로드맵 목록 조회 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

/**
 * GET
/api/v1/users/me/blogs
마이페이지 여행 기록 조회
 */
export const getMyTravelLogs = async (
  page: number,
  limit: number,
): Promise<MyTravelLogsResponse> => {
  const params = {
    page,
    limit,
  };
  try {
    const response = await privateApi.get<MyTravelLogsResponse>(
      '/api/v1/users/me/blogs',
      {
        headers: getAuthHeaders(),
        params,
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          '내가 작성한 블로그 목록 조회에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else {
      throw {
        message: '내가 작성한 블로그 목록 조회 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

/**
 * GET
/api/v1/users/me/liked-roadmaps
마이페이지 좋아요한 여행 일정 조회
 */
export const getMyLikedRoadmaps = async (
  page: number,
  limit: number,
): Promise<MyRoadmapsResponse> => {
  const params = {
    page,
    limit,
  };
  try {
    const response = await privateApi.get<MyRoadmapsResponse>(
      '/api/v1/users/me/liked-roadmaps',
      {
        headers: getAuthHeaders(),
        params,
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          '내가 좋아요한 로드맵 목록 조회에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else {
      throw {
        message: '내가 좋아요한 로드맵 목록 조회 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

/**
 * GET
/api/v1/users/me/liked-blogs
마이페이지 좋아요한 블로그 조회
 */
export const getMyLikedTravelLogs = async (
  page: number,
  limit: number,
): Promise<MyTravelLogsResponse> => {
  const params = {
    page,
    limit,
  };
  try {
    const response = await privateApi.get<MyTravelLogsResponse>(
      '/api/v1/users/me/liked-blogs',
      {
        headers: getAuthHeaders(),
        params,
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          '내가 좋아요한 블로그 목록 조회에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else {
      throw {
        message: '내가 좋아요한 블로그 목록 조회 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

/**
 * GET
/api/v1/users/me/liked-regions
마이페이지 좋아요한 여행지 조회
 */
export const getMyLikedRegions = async (
  page: number,
  limit: number,
): Promise<MyRegionsResponse> => {
  const params = {
    page,
    limit,
  };
  try {
    const response = await privateApi.get<MyRegionsResponse>(
      '/api/v1/users/me/liked-regions',
      {
        headers: getAuthHeaders(),
        params,
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          '내가 좋아요한 여행지 목록 조회에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else {
      throw {
        message: '내가 좋아요한 여행지 목록 조회 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};
