/**
 * Visited Countries API
 * 방문 국가 관련 API 호출 함수들
 */

import { publicApi } from './client';
import { getAccessToken } from './authUtils';
import { VisitedCountryListContainer } from './visited-countries.type';
import { ApiError } from './common.type';

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface GetMyVisitedCountriesParams {
  page?: number;
  limit?: number;
}

/**
 * GET /api/v1/visited-countries/me
 * 내 방문 국가 수 및 목록 조회
 */
export const getMyVisitedCountries = async ({
  page = 1,
  limit = 10,
}: GetMyVisitedCountriesParams = {}): Promise<VisitedCountryListContainer> => {
  try {
    const response = await publicApi.get<VisitedCountryListContainer>(
      '/api/v1/visited-countries/me',
      {
        headers: getAuthHeaders(),
        params: {
          page,
          limit,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          '방문 국가 수 및 목록 조회에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '서버와 연결할 수 없습니다.',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '방문 국가 수 및 목록 조회 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};
