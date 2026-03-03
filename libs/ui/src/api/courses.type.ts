import { Nullable, Pagination } from './common.type';

/**
 * 여행 코스 장소 타입 - 도메인타입
 */
export interface CoursePlace {
  id: string;
  visitOrder: number;
  dayNumber: number;
  memo: Nullable<string>;
  placeId: Nullable<string>;
  placeName: Nullable<string>;
  placeDescription: Nullable<string>;
  placeImageUrl: Nullable<string>;
  latitude: Nullable<number>;
  longitude: Nullable<number>;
  address: Nullable<string>;
  openingHours: Nullable<string>;
  category: Nullable<string>;
  createdAt: string;
  updatedAt: string;
}

/**
 * 여행 코스 타입 - 도메인타입
 */
export interface Course {
  id: string;
  title: string;
  duration: string;
  tags: string[];
  description: string;
  imageUrl: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

/**
 * 여행 코스 목록 계열 응답 타입
 * - courses 또는 items 중 하나만 내려온다
 */
export type CourseListContainer =
  | (Pagination & { courses: Course[]; items?: never })
  | (Pagination & { items: Course[]; courses?: never });
