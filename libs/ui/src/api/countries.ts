import { publicApi } from './client';
import { ApiError } from './common.type';

/**
 * 나라별 도시 목록 조회 API
 * GET /api/v1/countries/regions
 */
export const getCountries = async (): Promise<any> => {
  try {
    const response = await publicApi.get('/api/v1/countries/regions');
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
