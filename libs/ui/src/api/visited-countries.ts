/**
 * Visited Countries API
 * 방문 국가 관련 API 호출 함수들
 */

import { publicApi } from './client';
import {
  VisitedCountryListContainer,
  ApiError,
} from './visited-countries.type';

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getMyVisitedCountries = async (): Promise<VisitedCountryListContainer> => {
  try {
    const response = await publicApi.get<VisitedCountryListContainer>(
      '/api/v1/visited-countries/me',
      {
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message || '방문 국가 목록 조회에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '방문 국가 목록 조회 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

export const addVisitedCountry = async (countryName: string): Promise<VisitedCountryListContainer> => {
  try {
    const response = await publicApi.post<VisitedCountryListContainer>(
      '/api/v1/visited-countries',
      {
        countryName,
      },
      {
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message || '방문 국가 추가에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '방문 국가 추가 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};

export const removeVisitedCountry = async (id: string): Promise<VisitedCountryListContainer> => {
  try {
    const response = await publicApi.delete<VisitedCountryListContainer>(
      `/api/v1/visited-countries/${id}`,
      {
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message || '방문 국가 삭제에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '방문 국가 삭제 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};