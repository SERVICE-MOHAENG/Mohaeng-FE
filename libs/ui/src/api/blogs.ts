/**
 * Blogs API
 * 블로그 관련 API 호출 함수들
 */

import { publicApi } from './client';
import { getAccessToken } from './authUtils';
import {
  BlogListResponse,
  BlogDetailResponse,
  CreateBlogRequest,
  CreateBlogResponse,
} from './blogs.type';
import { ApiError } from './common.type';


const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * GET
/api/v1/blogs/mainpage
여행 블로그 목록 조회 (메인페이지)
 */
export const getMainBlogs = async (): Promise<BlogListResponse> => {
  try {
    const response = await publicApi.get<BlogListResponse>(
      '/api/v1/blogs/mainpage',
      {
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message || '블로그 목록 조회에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '블로그 목록 조회 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

/**
 * GET
/api/v1/blogs/{id}
블로그 상세 조회
 */
export const getBlogDetail = async (
  id: string,
): Promise<BlogDetailResponse> => {
  try {
    const response = await publicApi.get<BlogDetailResponse>(
      `/api/v1/blogs/${id}`,
      {
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message: error.response.data?.message || '블로그 조회에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '블로그 조회 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

/**
 * POST
/api/v1/blogs/{id}/like
블로그 좋아요 추가
 */
export const addBlogLike = async (id: string): Promise<BlogDetailResponse> => {
  try {
    const response = await publicApi.post<BlogDetailResponse>(
      `/api/v1/blogs/${id}/like`,
      undefined,
      {
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message || '블로그 좋아요 추가에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '블로그 좋아요 추가 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

/**
 * DELETE
/api/v1/blogs/{id}/like
블로그 좋아요 삭제
 */
export const removeBlogLike = async (
  id: string,
): Promise<BlogDetailResponse> => {
  try {
    const response = await publicApi.delete<BlogDetailResponse>(
      `/api/v1/blogs/${id}/like`,
      {
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message || '블로그 좋아요 삭제에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '블로그 좋아요 삭제 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

export const createBlog = async (
  payload: CreateBlogRequest,
): Promise<CreateBlogResponse> => {
  try {
    const response = await publicApi.post<CreateBlogResponse>('/api/v1/blogs', payload, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message: error.response.data?.message || '블로그 생성에 실패했습니다.',
        statusCode: error.response.status,
        errorCode: error.response.data?.errorCode,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '블로그 생성 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};
