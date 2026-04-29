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
  trip_days: number;
  summary: any;
  tags: string[];
  like_count: number;
  is_liked: boolean;
  is_completed?: boolean;
  image_url: any;
  // Deprecated/Compatibility fields
  duration?: string;
  description?: string;
  imageUrl?: string;
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

/**
 * 여행 코스 상세 장소 정보 타입
 */
export interface CourseDetailPlace {
  place_name: string;
  place_id: string;
  address: string;
  latitude: string | number;
  longitude: string | number;
  place_url: string;
  description: string;
  visit_sequence: number;
  visit_time: any;
  place_category?: string | null;
  primary_type?: string | null;
}

/**
 * 여행 코스 상세 일차별 정보 타입
 */
export interface CourseDetailDay {
  day_number: number;
  daily_date: string;
  places: CourseDetailPlace[];
}

/**
 * 여행 코스 상세 데이터 타입
 */
export interface CourseDetail {
  start_date: string;
  end_date: string;
  trip_days: number;
  nights: number;
  people_count: number;
  tags: string[];
  title: string;
  summary: string | any;
  itinerary: CourseDetailDay[];
  llm_commentary: any;
  next_action_suggestion: string[];
  userName?: string;
  authorName?: string;
  author_name?: string;
  isCompleted?: boolean;
  is_completed?: boolean;
  is_mine?: boolean;
  is_owner?: boolean;
  isMine?: boolean;
  isOwner?: boolean;
  hashTags?: string[];
}
