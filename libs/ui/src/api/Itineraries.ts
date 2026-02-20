/**
 * Itineraries API
 * 여행 일정 및 로드맵 관련 API 호출 함수들
 */

import { privateApi } from './client';
import { getAccessToken } from './authUtils';

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 로드맵 설문 저장 후 비동기 생성 시작
export const createItinerarySurvey = async (surveyData: any): Promise<any> => {
  try {
    const response = await privateApi.post(
      '/api/v1/itineraries/surveys',
      surveyData,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error: any) {
    throw handleApiError(error, '로드맵 설문 생성에 실패했습니다.');
  }
};

// 여행 일정 생성 요청 (비동기)
export const createItinerary = async (itineraryData: any): Promise<any> => {
  try {
    const response = await privateApi.post(
      '/api/v1/itineraries',
      itineraryData,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error: any) {
    throw handleApiError(error, '여행 일정 생성 요청에 실패했습니다.');
  }
};

// 일정 생성 작업 상태 조회 (Polling용)
export const getItineraryStatus = async (jobId: string): Promise<any> => {
  try {
    const response = await privateApi.get(
      `/api/v1/itineraries/${jobId}/status`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error: any) {
    throw handleApiError(error, '일정 생성 상태 조회에 실패했습니다.');
  }
};

// 일정 생성 결과 조회
export const getItineraryResult = async (jobId: string): Promise<any> => {
  try {
    const response = await privateApi.get(`/api/v1/itineraries/${jobId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw handleApiError(error, '일정 상세 결과 조회에 실패했습니다.');
  }
};

// 로드맵 수정 채팅 요청
export const chatItineraryEdit = async (
  id: string,
  message: string,
): Promise<any> => {
  try {
    const response = await privateApi.post(
      `/api/v1/itineraries/${id}/chat`,
      { message },
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error: any) {
    throw handleApiError(error, '로드맵 수정 요청에 실패했습니다.');
  }
};

// 로드맵 수정 작업 상태 조회
export const chatItineraryEditStatus = async (jobId: string): Promise<any> => {
  try {
    const response = await privateApi.get(
      `/api/v1/itineraries/modification-jobs/${jobId}/status`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error: any) {
    throw handleApiError(error, '로드맵 수정 요청에 실패했습니다.');
  }
};

// 공통 에러 핸들러 (코드 중복 줄이기용)
const handleApiError = (error: any, defaultMessage: string) => {
  if (error.response) {
    return {
      message: error.response.data?.message || defaultMessage,
      statusCode: error.response.status,
    };
  } else if (error.request) {
    return { message: '서버와 연결할 수 없습니다.', statusCode: 0 };
  } else {
    return { message: '오류가 발생했습니다.', statusCode: 0 };
  }
};
