import { ApiResponse, Pagination } from './common.type';

/**
 * 블로그 도메인 타입
 */
export interface Blog {
  id: string;
  author: string;
  date: string;
  title: string;
  content: string;
  imageUrl: string;
  avatarUrl?: string;
  likes: number;
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
