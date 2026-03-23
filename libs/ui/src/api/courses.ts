/**
 * Courses API
 * 코스 관련 API 호출 함수들
 */

import { publicApi } from './client';
import { getAccessToken } from './authUtils';
import { CourseListContainer, CourseDetail } from './courses.type';
import { ApiError, ApiResponse } from './common.type';

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/*GET
 /api/v1/courses/mainpage
 여행 코스 목록 조회 (메인페이지)
*/
export const getMainCourses = async (params?: {
  sortBy?: 'latest' | 'popular';
  countryCode?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<CourseListContainer>> => {
  try {
    const response = await publicApi.get<CourseListContainer>(
      '/api/v1/courses/mainpage',
      {
        params,
        headers: getAuthHeaders(),
      },
    );

    return response.data as any; // The middleware or server might already be wrapping this
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message || '코스 목록 조회에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '코스 목록 조회 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

/*
GET
/api/v1/courses/{courseId}
코스 상세 조회
*/
export const getCourseDetail = async (
  courseId: string,
): Promise<ApiResponse<CourseDetail>> => {
  try {
    const response = await publicApi.get<any>(`/api/v1/courses/${courseId}`, {
      headers: getAuthHeaders(),
    });

    // API returns { success: true, data: { data: { ... } } }
    const actualData =
      response.data?.data?.data || response.data?.data || response.data;

    return {
      success: true,
      data: actualData,
    };
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message || '코스 상세 조회에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '코스 상세 조회 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

/**
 * POST
/api/v1/courses/{id}/like
여행 코스 좋아요 추가
 */
export const addLike = async (
  courseId: string,
): Promise<ApiResponse<CourseListContainer>> => {
  try {
    const response = await publicApi.post<CourseListContainer>(
      `/api/v1/courses/${courseId}/like`,
      null,
      {
        headers: getAuthHeaders(),
      },
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          '여행 코스 좋아요 추가에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '여행 코스 좋아요 추가 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

/**
 * DELETE
/api/v1/courses/{id}/like
여행 코스 좋아요 삭제
 */
export const removeLike = async (
  courseId: string,
): Promise<ApiResponse<CourseListContainer>> => {
  try {
    const response = await publicApi.delete<CourseListContainer>(
      `/api/v1/courses/${courseId}/like`,
      {
        headers: getAuthHeaders(),
      },
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          '여행 코스 좋아요 삭제에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '여행 코스 좋아요 삭제 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

/**
 * 여행 코스 완료 여부 변경
 * PATCH /api/v1/courses/{courseId}/completion
 * @param courseId 여행 코스 ID
 * @param isCompleted 완료 여부
 * @returns
 */
export const updateCourseCompletion = async (
  courseId: string,
  isCompleted: boolean,
): Promise<ApiResponse<any>> => {
  try {
    const response = await publicApi.patch<any>(
      `/api/v1/courses/${courseId}/completion`,
      { 
        isCompleted,
        is_completed: isCompleted 
      },
      {
        headers: getAuthHeaders(),
      },
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          '여행 코스 완료 여부 변경에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '여행 코스 완료 여부 변경 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

/**
 * 로드맵 복사 (내 로드맵으로 가져오기)
 * POST /api/v1/courses/{id}/copy
 * @param courseId 복사할 코스 ID
 * @returns
 */
export const copyCourse = async (
  courseId: string,
): Promise<ApiResponse<{ id: string }>> => {
  try {
    const response = await publicApi.post<{ id: string }>(
      `/api/v1/courses/${courseId}/copy`,
      null,
      {
        headers: getAuthHeaders(),
      },
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      throw {
        message: error.response.data?.message || '로드맵 복사에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '로드맵 복사 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};
