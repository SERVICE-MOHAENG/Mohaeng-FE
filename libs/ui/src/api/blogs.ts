/**
 * Blogs API
 * 블로그 관련 API 호출 함수들
 */

import { publicApi } from './client';
import { getAccessToken } from './authUtils';
import { BlogListResponse, BlogDetailResponse, ApiError } from './blogs.type';

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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

export const getMyBlogs = async (): Promise<BlogDetailResponse> => {
  try {
    const response = await publicApi.get<BlogDetailResponse>(
      '/api/v1/blogs/me',
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

export const getMyLikedBlogs = async (): Promise<BlogDetailResponse> => {
  try {
    const response = await publicApi.get<BlogDetailResponse>(
      '/api/v1/blogs/me/likes',
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

export const addBlogLike = async (id: string): Promise<BlogDetailResponse> => {
  try {
    const response = await publicApi.post<BlogDetailResponse>(
      `/api/v1/blogs/${id}/like`,
      null,
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
