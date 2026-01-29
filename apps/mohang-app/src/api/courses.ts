/**
 * Courses API
 * 코스 관련 API 호출 함수들
 */

import { publicApi } from './client';
import { CourseListContainer, ApiError, ApiResponse } from './courses.type';

const token = localStorage.getItem('accessToken');

export const getMainCourses = async (): Promise<CourseListContainer> => {
  try {
    const response = await publicApi.get<CourseListContainer>(
      '/api/v1/courses/mainpage',
    );

    return response.data;
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

export const getMyCourses = async (): Promise<
  ApiResponse<CourseListContainer>
> => {
  try {
    const response = await publicApi.get<CourseListContainer>(
      '/api/v1/courses/me',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          error.response.data?.message || '내 여행 코스 조회에 실패했습니다.',
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

export const getMyBookmarkedCourses = async (): Promise<
  ApiResponse<CourseListContainer>
> => {
  try {
    const response = await publicApi.get<CourseListContainer>(
      '/api/v1/courses/me/bookmarks',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          error.response.data?.message || '내 북마크 코스 조회에 실패했습니다.',
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

export const getMyLikedCourses = async (): Promise<
  ApiResponse<CourseListContainer>
> => {
  try {
    const response = await publicApi.get<CourseListContainer>(
      '/api/v1/courses/me/likes',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          error.response.data?.message || '내 좋아요 조회에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '좋아요 조회 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

export const getCourseDetail = async (
  courseId: string,
): Promise<ApiResponse<CourseListContainer>> => {
  try {
    const response = await publicApi.get<CourseListContainer>(
      `/api/v1/courses/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

export const addBookmark = async (
  courseId: string,
): Promise<ApiResponse<CourseListContainer>> => {
  try {
    const response = await publicApi.post<CourseListContainer>(
      `/api/v1/courses/${courseId}/bookmarks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      throw {
        message: error.response.data?.message || '북마크 추가에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '북마크 추가 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};
