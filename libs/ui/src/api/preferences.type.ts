/**
 * Preferences API Types
 */

import { JobStatus } from './Itineraries';

export interface PreferenceData {
  weather: string;
  travel_range: string;
  travel_style: string;
  food_personality: string[];
  main_interests: string[];
  budget_level: string;
}

export interface PreferenceResponse {
  id: string;
  userId: string;
  weather: string;
  travelRange: string;
  travelStyle: string;
  foodPersonality: string[];
  mainInterests: string[];
  budgetLevel: string;
}

export interface PreferenceRecommendation {
  regionName: string;
  description: string | null;
  imageUrl: string | null;
  regionId: string | null;
  likeCount: number;
  isLiked: boolean;
}

export interface PreferenceJobStatus {
  status: JobStatus | 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
}

export type PreferenceResultResponse = PreferenceRecommendation[];
export type PreferenceJobResult = PreferenceRecommendation[];
