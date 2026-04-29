export const PLACE_CATEGORY_FALLBACK_CODE = 'OTHER';
export const PLACE_CATEGORY_FALLBACK_LABEL = '기타 장소';

const PLACE_CATEGORY_ALIASES: Record<string, string> = {
  ATTRACTION: 'TOURIST_ATTRACTION',
  CULTURAL: 'CULTURAL_SITE',
  CULTURE: 'CULTURAL_SITE',
  DINING: 'RESTAURANT',
  EXPERIENCES: 'EXPERIENCE',
  FOOD: 'RESTAURANT',
  HISTORY: 'HISTORICAL_SITE',
  HOTEL: 'ACCOMMODATION',
  LANDSCAPE: 'NATURE',
  LODGING: 'ACCOMMODATION',
  LOCAL_EXPERIENCE: 'EXPERIENCE',
  NATURAL: 'NATURE',
  STAY: 'ACCOMMODATION',
  TOURIST_SPOT: 'TOURIST_ATTRACTION',
  TOURIST_SPOTS: 'TOURIST_ATTRACTION',
  TRANSIT: 'TRANSPORTATION',
  UNKNOWN: PLACE_CATEGORY_FALLBACK_CODE,
};

export const PLACE_CATEGORY_LABELS: Record<string, string> = {
  ACCOMMODATION: '숙소',
  ACTIVITY: '액티비티',
  BAR: '바',
  BEACH: '해변',
  CAFE: '카페',
  CULTURAL_SITE: '문화 명소',
  EXPERIENCE: '체험',
  GALLERY: '전시 공간',
  HISTORICAL_SITE: '역사 명소',
  LANDMARK: '랜드마크',
  MARKET: '시장',
  MUSEUM: '박물관',
  NATURE: '자연 명소',
  NIGHTLIFE: '야간 명소',
  OTHER: PLACE_CATEGORY_FALLBACK_LABEL,
  PARK: '공원',
  RELIGIOUS_SITE: '종교 명소',
  RESTAURANT: '음식점',
  SHOPPING: '쇼핑',
  SHOPPING_MALL: '쇼핑몰',
  TOURIST_ATTRACTION: '관광 명소',
  TRANSPORTATION: '교통',
  VIEWPOINT: '전망 포인트',
};

export interface RawItineraryPlace {
  id?: string | number | null;
  place_id?: string | null;
  place_name?: string | null;
  address?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  place_url?: string | null;
  description?: string | null;
  visit_sequence?: number | null;
  visit_time?: string | null;
  place_category?: string | null;
  primary_type?: string | null;
}

export interface RawItineraryDay {
  day_number?: number | null;
  daily_date?: string | null;
  places?: RawItineraryPlace[] | null;
}

export interface PlaceMapPosition {
  lat: number;
  lng: number;
}

export interface NormalizedSchedulePlace {
  id: string;
  placeId: string | null;
  title: string;
  location: string;
  description: string;
  time: string;
  position?: PlaceMapPosition;
  placeUrl: string | null;
  visitSequence: number | null;
  placeCategory: string;
  placeCategoryLabel: string;
  isCategoryFallback: boolean;
}

export interface NormalizedItineraryDay {
  dayNumber: number;
  dailyDate: string;
  places: NormalizedSchedulePlace[];
}

const normalizeNumericValue = (value: string | number | null | undefined) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

export const normalizePlaceCategoryCode = (
  categoryCode: string | null | undefined,
) => {
  const normalizedCode = String(categoryCode || '')
    .trim()
    .toUpperCase();

  if (!normalizedCode) {
    return PLACE_CATEGORY_FALLBACK_CODE;
  }

  return PLACE_CATEGORY_ALIASES[normalizedCode] || normalizedCode;
};

const getPlaceCategoryInfo = (categoryCode: string | null | undefined) => {
  const normalizedCode = normalizePlaceCategoryCode(categoryCode);
  const label = PLACE_CATEGORY_LABELS[normalizedCode];

  if (label) {
    return {
      code: normalizedCode,
      label,
      isFallback: normalizedCode === PLACE_CATEGORY_FALLBACK_CODE,
    };
  }

  return {
    code: PLACE_CATEGORY_FALLBACK_CODE,
    label: PLACE_CATEGORY_FALLBACK_LABEL,
    isFallback: true,
  };
};

export const normalizeSchedulePlace = (
  place: RawItineraryPlace,
  options?: { dayNumber?: number; index?: number },
): NormalizedSchedulePlace => {
  const lat = normalizeNumericValue(place.latitude);
  const lng = normalizeNumericValue(place.longitude);
  const position =
    lat !== null && lng !== null
      ? {
          lat,
          lng,
        }
      : undefined;
  const category = getPlaceCategoryInfo(
    place.place_category ?? place.primary_type,
  );
  const fallbackId = [
    place.place_id || 'place',
    options?.dayNumber ?? 'day',
    options?.index ?? 'idx',
  ].join('-');

  return {
    id: String(place.id ?? fallbackId),
    placeId: place.place_id ?? null,
    title: String(place.place_name || '').trim() || '이름 없는 장소',
    location:
      String(place.address || '').trim() ||
      String(place.place_name || '').trim() ||
      '위치 정보 없음',
    description: String(place.description || '').trim(),
    time:
      String(place.visit_time || '').trim() ||
      (typeof place.visit_sequence === 'number'
        ? `${place.visit_sequence}번째 방문`
        : '시간 미정'),
    position,
    placeUrl: place.place_url ?? null,
    visitSequence:
      typeof place.visit_sequence === 'number' ? place.visit_sequence : null,
    placeCategory: category.code,
    placeCategoryLabel: category.label,
    isCategoryFallback: category.isFallback,
  };
};

export const normalizeItineraryDays = (
  itinerary: RawItineraryDay[] | null | undefined,
) =>
  (itinerary || []).map((day, dayIndex): NormalizedItineraryDay => ({
    dayNumber:
      typeof day.day_number === 'number' && Number.isFinite(day.day_number)
        ? day.day_number
        : dayIndex + 1,
    dailyDate: String(day.daily_date || '').trim(),
    places: (day.places || []).map((place, placeIndex) =>
      normalizeSchedulePlace(place, {
        dayNumber:
          typeof day.day_number === 'number' && Number.isFinite(day.day_number)
            ? day.day_number
            : dayIndex + 1,
        index: placeIndex,
      }),
    ),
  }));
