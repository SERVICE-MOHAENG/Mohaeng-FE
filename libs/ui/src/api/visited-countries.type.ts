import { Nullable, Pagination } from './common.type';

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
  count: number;
  items: VisitedCountry[];
};
