/**
 * Preferences API
 * 선호도 등록, 조회 및 추천 작업 관련 API 호출 함수들
 */

import { privateApi } from './client';
import { getAccessToken } from './authUtils';
import {
  PreferenceJobStatus,
  PreferenceJobResult,
} from './preferences.type';

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * 선호도 등록/수정 후 여행지 추천 작업 시작 (비동기)
 * POST /api/v1/preferences
 */
export const createOrUpdatePreferences = async () => {
  try {
    const response = await privateApi.post('/api/v1/preferences');
    return response.data;
  } catch (error: any) {
    throw handleApiError(error, '선호도 등록에 실패했습니다.');
  }
};

/**
 * 내 선호도 조회
 * GET /api/v1/preferences/me
 */
export const getMyPreferences = async () => {
  try {
    const response = await privateApi.get('/api/v1/preferences/me');
    return response.data;
  } catch (error: any) {
    throw handleApiError(error, '선호도 조회에 실패했습니다.');
  }
};

/**
 * 추천 작업 상태 조회 (Polling)
 * GET /api/v1/preferences/jobs/{jobId}/status
 */
export const getPreferenceJobStatus = async (
  jobId: string,
): Promise<PreferenceJobStatus> => {
  try {
    const response = await privateApi.get<PreferenceJobStatus>(
      `/api/v1/preferences/jobs/${jobId}/status`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error: any) {
    throw handleApiError(error, '추천 작업 상태 조회에 실패했습니다.');
  }
};

/**
 * 추천 여행지 결과 조회 (이미지, 설명 포함)
 * GET /api/v1/preferences/jobs/{jobId}/result
 */
export const getPreferenceJobResult = async (
  jobId: string,
): Promise<PreferenceJobResult> => {
  try {
    const response = await privateApi.get<PreferenceJobResult>(
      `/api/v1/preferences/jobs/${jobId}/result`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error: any) {
    throw handleApiError(error, '추천 결과 조회에 실패했습니다.');
  }
};

/**
 * 공통 에러 핸들러
 */
const handleApiError = (error: any, defaultMessage: string) => {
  if (error.response) {
    return {
      message: error.response.data?.message || defaultMessage,
      statusCode: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    return { message: '서버와 연결할 수 없습니다.', statusCode: 0, data: null };
  } else {
    return { message: '오류가 발생했습니다.', statusCode: 0, data: null };
  }
};
