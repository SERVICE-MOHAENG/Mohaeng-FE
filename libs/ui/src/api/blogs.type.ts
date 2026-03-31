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
export interface CreateBlogRequest {
  travelCourseId: string;
  title: string;
  content: string;
  imageUrls: string[];
  tags: string[];
  isPublic: boolean;
}

export interface CreatedBlog {
  id: string;
  travelCourseId: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  imageUrls: string[];
  tags: string[];
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
  isLiked: boolean;
}

export interface BlogDetail extends CreatedBlog {
  imageUrl?: string | null;
}

export type BlogDetailResponse = ApiResponse<BlogDetail>;
export type CreateBlogResponse = ApiResponse<CreatedBlog>;
