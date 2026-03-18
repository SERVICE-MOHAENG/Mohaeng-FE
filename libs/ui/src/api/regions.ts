import { publicApi } from './client';

export interface RegionCoursePlace {
  id: string;
  visitOrder: number;
  dayNumber: number;
  memo: string | null;
  placeId: string | null;
  placeName: string | null;
  placeDescription: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  placeUrl: string | null;
}

export interface RegionCourse {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  viewCount: number;
  nights: number;
  days: number;
  likeCount: number;
  modificationCount: number;
  userId: string;
  userName: string;
  countries: string[];
  regionNames: string[];
  hashTags: string[];
  places: RegionCoursePlace[];
  isPublic: boolean;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  sourceCourseId: string | null;
  isLiked: boolean;
}

export interface GetRegionCoursesResponse {
  courses: RegionCourse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetRegionCoursesParams {
  id: string;
  sortBy?: 'latest' | 'popular';
  page?: number;
  limit?: number;
}

/**
 * 특정 지역의 공개 로드맵 목록 조회
 */
export const getRegionCourses = async ({
  id,
  sortBy = 'latest',
  page = 1,
  limit = 10,
}: GetRegionCoursesParams): Promise<GetRegionCoursesResponse> => {
  const response = await publicApi.get(`/api/v1/regions/${id}/courses`, {
    params: { sortBy, page, limit },
  });
  return response.data;
};
