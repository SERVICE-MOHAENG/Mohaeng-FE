/**
 * Preferences API Types
 */

import { JobStatus } from './Itineraries';

/**
 * 선호도 데이터 타입
 */
export interface PreferenceData {
  pace_preference: string;
  planning_preference: string;
  destination_preference: string;
  activity_preference: string;
  priority_preference: string;
  notes?: string;
}

/**
 * 선호도 응답 타입
 */
export interface PreferenceResponse {
  id: string;
  userId: string;
  preferences: PreferenceData;
  createdAt: string;
  updatedAt: string;
}

/**
 * 추천 작업 상태 응답 타입 (Polling용)
 */
export interface PreferenceJobStatus {
  jobId: string;
  status: JobStatus;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

/**
 * 추천 여행지 결과 상세 타입
 */
export interface RecommendedDestination {
  placeId: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
}

/**
 * 추천 결과 응답 타입
 */
export interface PreferenceJobResult {
  jobId: string;
  status: JobStatus;
  destinations: RecommendedDestination[];
}
