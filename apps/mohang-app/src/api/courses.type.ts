/**
 * 여행 코스 목록 요청 데이터 타입
 */

type Nullable<T> = T | null;

/**
 * API 응답 타입
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * API 에러 응답 타입
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
  description: Nullable<string>;
  imageUrl: Nullable<string>;
  viewCount: number;
  nights: number;
  days: number;
  likeCount: number;
  bookmarkCount: number;
  userId: string;
  userName: string;
  countries: string[];
  hashTags: string[];
  places: CoursePlace[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

/**
 * 여행 코스 목록 계열 응답 타입
 * - courses 또는 items 중 하나만 내려온다
 */
export type CourseListContainer =
  | (Pagination & { courses: Course[]; items?: never })
  | (Pagination & { items: Course[]; courses?: never });
