/**
 * Nullable utility type
 */
export type Nullable<T> = T | null;

/**
 * Common API Response type
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * Common API Error type
 */
export interface ApiError {
  message: string;
  statusCode: number;
  errorCode?: string;
  reactivationToken?: string;
}

/**
 * Common Pagination type
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
