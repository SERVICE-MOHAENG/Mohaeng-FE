import { ApiResponse, Pagination } from './common.type';

export interface Blog {
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

export interface BlogListData extends Pagination {
  blogs: Blog[];
}

export type BlogListResponse = BlogListData;

export interface GetMainBlogsParams {
  sortBy?: 'latest' | 'popular';
  page?: number;
  limit?: number;
}

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

export interface BlogDetail extends CreatedBlog {}

export type BlogDetailResponse = ApiResponse<BlogDetail>;
export type CreateBlogResponse = ApiResponse<CreatedBlog>;
