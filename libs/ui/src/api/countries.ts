import { publicApi } from './client';
import { ApiError } from './common.type';

/**
 * 지역(도시) 정보 타입
 */
export interface Region {
  id: string;
  name: string;
  imageUrl: string;
}

/**
 * 나라별 도시 목록 응답 타입
 */
export interface RegionsResponse {
  regions: Region[];
}

/**
 * 나라별 도시 목록 조회 API
 * GET /api/v1/countries/regions
 */
export const getCountries = async (
  countryName: string,
): Promise<RegionsResponse> => {
  try {
    const response = await publicApi.get<RegionsResponse>(
      '/api/v1/countries/regions',
      {
        params: { countryName },
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message || '국가 정보 조회에 실패했습니다.',
        statusCode: error.response.status,
      } as ApiError;
    } else {
      throw {
        message: '국가 정보 조회 중 오류가 발생했습니다.',
        statusCode: 0,
      } as ApiError;
    }
  }
};
