/**
 * 공통 유틸 타입
 */
export type Nullable<T> = T | null;

/**
 * API 공통 응답 타입
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * API 에러 타입
 */
export interface ApiError {
  message: string;
  statusCode: number;
}

/**
 * 페이지네이션 공통 타입
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * 방문 국가 도메인 타입
 */
export interface VisitedCountry {
  id: string;
  countryName: string;
  visitDate: Nullable<string>;
  createdAt: string;
}

/**
 * 방문 국가 목록 응답 컨테이너
 */
export type VisitedCountryListContainer = Pagination & {
  items: VisitedCountry[];
};
