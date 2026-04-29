/**
 * Itineraries API
 * 여행 일정 및 로드맵 관련 API 호출 함수들
 */

import { privateApi } from './client';
import { getAccessToken } from './authUtils';

/**
 * 작업 상태 타입
 */
export type JobStatus = 'PENDING' | any;

/**
 * 일정 생성 상태 응답 타입
 */
export interface ItineraryStatus {
  status: JobStatus;
  attemptCount: number;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  travelCourseId: string | null;
}

/**
 * 일정 장소 정보 타입
 */
export interface ItineraryPlace {
  place_name: string;
  place_id: string;
  address: string;
  latitude: number;
  longitude: number;
  place_url: string;
  description: string;
  visit_sequence: number;
  visit_time: any;
  place_category?: string | null;
  primary_type?: string | null;
}

/**
 * 일정 일차별 정보 타입
 */
export interface ItineraryDay {
  day_number: number;
  daily_date: string;
  places: ItineraryPlace[];
}

/**
 * 일정 지역 정보 타입
 */
export interface ItineraryRegion {
  region_name: string;
  start_date: string;
  end_date: string;
}

/**
 * 일정 상세 데이터 타입
 */
export interface ItineraryData {
  start_date: string;
  end_date: string;
  trip_days: number;
  nights: number;
  people_count: number;
  regions: ItineraryRegion[];
  tags: string[];
  title: string;
  summary: any;
  itinerary: ItineraryDay[];
  llm_commentary: any;
  next_action_suggestion: string[];
}

/**
 * 일정 생성 결과 응답 타입
 */
export interface ItineraryResult {
  status: JobStatus;
  travelCourseId: string | null;
  data: ItineraryData | null;
  error?: {
    code: string;
    message: string;
  } | null;
}

/**
 * 로드맵 수정 채팅 응답 타입
 */
export interface ChatEditResponse {
  jobId: string;
  status: JobStatus;
  message: string;
}

export interface ItineraryChatHistoryMessage {
  id?: string | number;
  role?: 'USER' | 'ASSISTANT' | 'SYSTEM' | 'user' | 'assistant' | 'ai';
  sender?: 'user' | 'assistant' | 'ai';
  content?: string;
  message?: string;
  text?: string;
  createdAt?: string;
  created_at?: string;
  timestamp?: string;
}

export const getItineraryChatHistory = async (
  travelCourseId: string | null,
): Promise<ItineraryChatHistoryMessage[]> => {
  if (!travelCourseId) {
    return [];
  }

  try {
    const response = await privateApi.get(
      `/api/v1/itineraries/${travelCourseId}/chats`,
      {
        headers: getAuthHeaders(),
      },
    );

    const payload = response.data?.data || response.data;

    if (Array.isArray(payload)) {
      return payload;
    }

    if (Array.isArray(payload?.chats)) {
      return payload.chats;
    }

    if (Array.isArray(payload?.messages)) {
      return payload.messages;
    }

    if (Array.isArray(payload?.history)) {
      return payload.history;
    }

    return [];
  } catch (error: any) {
    throw handleApiError(error, '채팅 내역 조회에 실패했습니다.');
  }
};

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

/**
 * 여행 일정 생성 요청 (비동기)
 * @param data surveyId를 포함한 객체 또는 surveyId 문자열
 */
export const createItinerary = async (
  data: string | { surveyId: string },
): Promise<any> => {
  try {
    const payload = typeof data === 'string' ? { surveyId: data } : data;
    const response = await privateApi.post('/api/v1/itineraries', payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw handleApiError(error, '여행 일정 생성 요청에 실패했습니다.');
  }
};

// 일정 생성 작업 상태 조회 (Polling용)
export const getItineraryStatus = async (
  jobId: string | null,
): Promise<ItineraryStatus> => {
  if (!jobId) {
    throw { message: 'jobId가 없습니다.', statusCode: 400 };
  }
  try {
    const response = await privateApi.get<ItineraryStatus>(
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
export const getItineraryResult = async (
  jobId: string | null,
): Promise<ItineraryResult> => {
  if (!jobId) {
    throw { message: 'jobId가 없습니다.', statusCode: 400 };
  }
  try {
    const response = await privateApi.get<ItineraryResult>(
      `/api/v1/itineraries/${jobId}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error: any) {
    throw handleApiError(error, '일정 상세 결과 조회에 실패했습니다.');
  }
};

// 로드맵 수정 채팅 요청
export const chatItineraryEdit = async (
  travelCourseId: string,
  message: string,
): Promise<ChatEditResponse> => {
  try {
    const response = await privateApi.post<ChatEditResponse>(
      `/api/v1/itineraries/${travelCourseId}/chat`,
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
export const chatItineraryEditStatus = async (
  jobId: string | null,
): Promise<any> => {
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
      data: error.response.data,
    };
  } else if (error.request) {
    return { message: '서버와 연결할 수 없습니다.', statusCode: 0, data: null };
  } else {
    return { message: '오류가 발생했습니다.', statusCode: 0, data: null };
  }
};
