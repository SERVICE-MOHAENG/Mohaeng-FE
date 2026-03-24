/**
 * Preferences API
 */

import { privateApi } from './client';
import { getAccessToken } from './authUtils';
import {
  PreferenceData,
  PreferenceResponse,
  PreferenceJobStatus,
  PreferenceJobResult,
  PreferenceResultResponse,
} from './preferences.type';

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  const token = getAccessToken();
  return token && token !== 'undefined'
    ? { Authorization: `Bearer ${token}` }
    : {};
};

export const createOrUpdatePreferences = async (
  preferences: PreferenceData,
): Promise<{ jobId: string; status: string }> => {
  try {
    const response = await privateApi.post('/api/v1/preferences', preferences, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw handleApiError(error, '선호도 등록에 실패했습니다.');
  }
};

export const getMyPreferences = async (): Promise<PreferenceResponse> => {
  try {
    const response = await privateApi.get<PreferenceResponse>(
      '/api/v1/preferences/me',
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error: any) {
    throw handleApiError(error, '선호도 조회에 실패했습니다.');
  }
};

export const getMyPreferenceResult =
  async (): Promise<PreferenceResultResponse> => {
    try {
      const response = await privateApi.get<PreferenceResultResponse>(
        '/api/v1/preferences/me/result',
        {
          headers: getAuthHeaders(),
        },
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, '추천 결과 조회에 실패했습니다.');
    }
  };

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
