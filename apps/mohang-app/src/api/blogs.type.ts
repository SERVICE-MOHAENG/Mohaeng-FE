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
 * 블로그 도메인 타입
 */
export interface Blog {
  id: string;
  title: string;
  content: string;
  imageUrl: Nullable<string>;
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  userId: string;
  userName: string;
  isLiked: boolean;
}

/**
 * 블로그 목록 데이터 타입
 */
export interface BlogListData extends Pagination {
  items: Blog[];
}

/**
 * 블로그 목록 API 응답 타입
 */
export type BlogListResponse = ApiResponse<BlogListData>;

/**
 * 블로그 상세 API 응답 타입
 */
export type BlogDetailResponse = ApiResponse<Blog>;
