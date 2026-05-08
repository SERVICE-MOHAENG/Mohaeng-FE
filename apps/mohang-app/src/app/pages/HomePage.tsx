import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { colors, typography } from '@mohang/ui';
import { useAlert } from '../context/AlertContext';
import ServiceEndNoticeModal from '../components/ServiceEndNoticeModal';
import {
  Header,
  TravelCard,
  CourseSection,
  DestinationList,
  Destination,
  Globe,
  FloatingActionButton,
  BlogList,
  FeedGrid,
  FeedItem,
  getAccessToken,
  getMainCourses,
  getMainBlogs,
  getMyVisitedCountries,
  getMyPreferences,
  getMyPreferenceResult,
  getPreferenceJobStatus,
  getPreferenceJobResult,
  addRegionLike,
  removeRegionLike,
  PreferenceRecommendation,
  PreferenceResponse,
  getMainPageUser,
  UserResponse,
  VisitedCountry,
  GlobeProps,
} from '@mohang/ui';

interface HomePageProps {
  initialUser?: UserResponse | null;
}

interface RecommendedDestinationCard {
  placeId: string;
  name: string;
  description: string;
  imageUrl: string;
  isLiked: boolean;
  likeCount: number;
}

interface NormalizedPreferenceProfile {
  weather: string | null;
  travelRange: string | null;
  travelStyle: string | null;
  budgetLevel: string | null;
  foodPersonality: string[];
  mainInterests: string[];
}

const FALLBACK_REGION_IMAGE =
  'https://images.pexels.com/photos/9782676/pexels-photo-9782676.jpeg';
const PREFERENCE_JOB_STORAGE_KEY = 'preference-job-id';

const readStoredPreferenceJobId = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedJobId = window.localStorage.getItem(PREFERENCE_JOB_STORAGE_KEY);
  return storedJobId && storedJobId.trim().length > 0 ? storedJobId : null;
};

const persistPreferenceJobId = (jobId: string) => {
  if (typeof window === 'undefined' || !jobId.trim()) {
    return;
  }

  window.localStorage.setItem(PREFERENCE_JOB_STORAGE_KEY, jobId);
};

const extractPreferenceJobId = (payload: any): string | null => {
  const source = payload?.data || payload;
  const jobId =
    source?.jobId ||
    source?.job_id ||
    source?.lastJobId ||
    source?.last_job_id ||
    source?.latestJobId ||
    source?.latest_job_id ||
    source?.preferenceJobId ||
    source?.preference_job_id ||
    source?.preferenceJob?.jobId ||
    source?.preference_job?.jobId ||
    source?.latestJob?.jobId ||
    source?.latest_job?.jobId ||
    source?.recommendationJob?.jobId ||
    source?.recommendation_job?.jobId ||
    source?.result?.jobId ||
    source?.status?.jobId ||
    null;

  return typeof jobId === 'string' && jobId.trim().length > 0 ? jobId : null;
};

const PREFERENCE_LABELS: Record<string, string> = {
  OCEAN_BEACH: '바다와 해변',
  SNOW_HOT_SPRING: '눈과 온천',
  CLEAN_CITY_BREEZE: '도시 산책',
  INDOOR_LANDMARK: '실내 랜드마크',
  SHORT_HAUL: '단거리 비행',
  MEDIUM_HAUL: '중거리 비행',
  LONG_HAUL: '장거리 비행',
  MODERN_TRENDY: '모던한 도시',
  HISTORIC_RELAXED: '여유로운 역사 도시',
  PURE_NATURE: '자연 중심',
  COST_EFFECTIVE: '가성비 여행',
  BALANCED: '균형 잡힌 여행',
  PREMIUM_LUXURY: '프리미엄 여행',
  LOCAL_HIDDEN_GEM: '로컬 스팟',
  FINE_DINING: '파인 다이닝',
  INSTAGRAMMABLE: '감성 카페',
  SHOPPING_TOUR: '쇼핑 투어',
  DYNAMIC_ACTIVITY: '액티비티',
  ART_AND_CULTURE: '예술과 문화',
};

const COUNTRY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'south korea': { lat: 36.5, lon: 127.8 },
  korea: { lat: 36.5, lon: 127.8 },
  '\uB300\uD55C\uBBFC\uAD6D': { lat: 36.5, lon: 127.8 },
  '\uD55C\uAD6D': { lat: 36.5, lon: 127.8 },
  japan: { lat: 36.2, lon: 138.25 },
  '\uC77C\uBCF8': { lat: 36.2, lon: 138.25 },
  'united states': { lat: 39.8, lon: -98.6 },
  usa: { lat: 39.8, lon: -98.6 },
  '\uBBF8\uAD6D': { lat: 39.8, lon: -98.6 },
  france: { lat: 46.2, lon: 2.2 },
  '\uD504\uB791\uC2A4': { lat: 46.2, lon: 2.2 },
  'united kingdom': { lat: 55.4, lon: -3.4 },
  uk: { lat: 55.4, lon: -3.4 },
  '\uC601\uAD6D': { lat: 55.4, lon: -3.4 },
  italy: { lat: 41.9, lon: 12.6 },
  '\uC774\uD0C8\uB9AC\uC544': { lat: 41.9, lon: 12.6 },
  spain: { lat: 40.4, lon: -3.7 },
  '\uC2A4\uD398\uC778': { lat: 40.4, lon: -3.7 },
  germany: { lat: 51.2, lon: 10.4 },
  '\uB3C5\uC77C': { lat: 51.2, lon: 10.4 },
  china: { lat: 35.9, lon: 104.2 },
  '\uC911\uAD6D': { lat: 35.9, lon: 104.2 },
  taiwan: { lat: 23.7, lon: 121.0 },
  '\uB300\uB9CC': { lat: 23.7, lon: 121.0 },
  thailand: { lat: 15.87, lon: 100.99 },
  '\uD0DC\uAD6D': { lat: 15.87, lon: 100.99 },
  vietnam: { lat: 14.06, lon: 108.28 },
  '\uBCA0\uD2B8\uB0A8': { lat: 14.06, lon: 108.28 },
  singapore: { lat: 1.35, lon: 103.82 },
  '\uC2F1\uAC00\uD3EC\uB974': { lat: 1.35, lon: 103.82 },
  malaysia: { lat: 4.21, lon: 101.98 },
  '\uB9D0\uB808\uC774\uC2DC\uC544': { lat: 4.21, lon: 101.98 },
  indonesia: { lat: -2.55, lon: 118.01 },
  '\uC778\uB3C4\uB124\uC2DC\uC544': { lat: -2.55, lon: 118.01 },
  philippines: { lat: 12.88, lon: 121.77 },
  '\uD544\uB9AC\uD540': { lat: 12.88, lon: 121.77 },
  australia: { lat: -25.27, lon: 133.77 },
  '\uD638\uC8FC': { lat: -25.27, lon: 133.77 },
  canada: { lat: 56.13, lon: -106.35 },
  '\uCE90\uB098\uB2E4': { lat: 56.13, lon: -106.35 },
  mexico: { lat: 23.63, lon: -102.55 },
  '\uBA55\uC2DC\uCF54': { lat: 23.63, lon: -102.55 },
  turkey: { lat: 38.96, lon: 35.24 },
  '\uD280\uB974\uD0A4\uC608': { lat: 38.96, lon: 35.24 },
  turkeye: { lat: 38.96, lon: 35.24 },
};

const normalizeCountryName = (countryName: string) =>
  countryName.trim().toLowerCase();

const getVisitedCountrySortDate = (country: VisitedCountry) =>
  new Date(country.visitDate || country.createdAt).getTime();

const getPreferenceLabel = (value: unknown) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return null;
  }

  return PREFERENCE_LABELS[value] || value.replace(/_/g, ' ');
};

const normalizePreferenceArray = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => getPreferenceLabel(item))
    .filter(Boolean) as string[];
};

const normalizePreferenceProfile = (
  preferenceData: PreferenceResponse | null | undefined | any,
): NormalizedPreferenceProfile | null => {
  const source = preferenceData?.data || preferenceData;

  if (!source) {
    return null;
  }

  const profile: NormalizedPreferenceProfile = {
    weather: getPreferenceLabel(source.weather),
    travelRange: getPreferenceLabel(source.travelRange ?? source.travel_range),
    travelStyle: getPreferenceLabel(source.travelStyle ?? source.travel_style),
    budgetLevel: getPreferenceLabel(source.budgetLevel ?? source.budget_level),
    foodPersonality: normalizePreferenceArray(
      source.foodPersonality ?? source.food_personality,
    ),
    mainInterests: normalizePreferenceArray(
      source.mainInterests ?? source.main_interests,
    ),
  };

  const hasAnyPreference = Boolean(
    profile.weather ||
      profile.travelRange ||
      profile.travelStyle ||
      profile.budgetLevel ||
      profile.foodPersonality.length > 0 ||
      profile.mainInterests.length > 0,
  );

  return hasAnyPreference ? profile : null;
};

const buildPreferenceTags = (profile: NormalizedPreferenceProfile) =>
  [
    profile.weather,
    profile.travelRange,
    profile.travelStyle,
    profile.budgetLevel,
    ...profile.foodPersonality,
    ...profile.mainInterests,
  ].filter(Boolean) as string[];

const mapPreferenceRecommendation = (
  item: PreferenceRecommendation,
): RecommendedDestinationCard => ({
  placeId: item.regionId || item.regionName,
  name: item.regionName,
  description: item.description || '여행 계획을 세워보세요!',
  imageUrl: item.imageUrl || FALLBACK_REGION_IMAGE,
  isLiked: item.isLiked ?? false,
  likeCount: Number(item.likeCount ?? 0),
});

const extractNormalizedPreferenceRecommendations = (payload: any) => {
  const source = payload?.data || payload;
  const items = Array.isArray(source)
    ? source
    : source?.destinations ||
      source?.recommendations ||
      source?.items ||
      source?.regions ||
      source?.results ||
      [];

  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const rawRegionId =
        item?.regionId || item?.region_id || item?.placeId || item?.place_id;
      const name =
        item?.regionName || item?.region_name || item?.name || item?.title || '';
      const description = item?.description ?? item?.summary;
      const imageUrl = item?.imageUrl ?? item?.image_url;

      if (
        typeof name !== 'string' ||
        name.trim() === '' ||
        typeof rawRegionId !== 'string' ||
        rawRegionId.trim() === '' ||
        typeof description !== 'string' ||
        description.trim() === '' ||
        typeof imageUrl !== 'string' ||
        imageUrl.trim() === ''
      ) {
        return null;
      }

      return mapPreferenceRecommendation({
        regionId: rawRegionId,
        regionName: name,
        description,
        imageUrl,
        isLiked: Boolean(item?.isLiked ?? item?.is_liked ?? false),
        likeCount: Number(item?.likeCount ?? item?.like_count ?? 0),
      } as PreferenceRecommendation);
    })
    .filter(Boolean) as RecommendedDestinationCard[];
};

const RecommendationLikeButton = ({
  isLiked,
  onClick,
  likeCount,
}: {
  isLiked: boolean;
  onClick: () => void;
  likeCount: number;
}) => (
  <div className="absolute right-4 top-4 flex w-16 flex-col items-center gap-1">
    <button
      type="button"
      onClick={onClick}
      className="flex h-16 w-16 items-center justify-center rounded-full bg-black/18 backdrop-blur-[10px] transition hover:bg-black/28"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-8 w-8 fill-[#FF2D55] text-[#FF2D55]"
        stroke="none"
      >
        <path d="M12 21s-6.716-4.351-9.192-8.247C.705 9.453 2.03 5.25 5.788 4.302c2.11-.532 4.205.326 5.41 2.05 1.205-1.724 3.3-2.582 5.41-2.05 3.758.948 5.083 5.151 2.98 8.451C18.716 16.649 12 21 12 21Z" />
      </svg>
    </button>
    <span className="text-center text-[16px] font-medium leading-6 text-[#FAFAFA]">
      {likeCount.toLocaleString('ko-KR')}
    </span>
  </div>
);

const PreferenceRecommendationCard = ({
  destination,
  rank = 0,
  featured = false,
  onLikeToggle,
}: {
  destination: RecommendedDestinationCard;
  rank?: number;
  featured?: boolean;
  onLikeToggle: (id: string, currentlyLiked: boolean) => void;
}) => (
  <article
    className="group relative h-[332px] w-[274px] shrink-0 overflow-hidden rounded-[14px]"
  >
    <img
      src={destination.imageUrl}
      alt={destination.name}
      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
    />
    <div
      className={`absolute inset-0 ${
        featured
          ? 'bg-gradient-to-b from-slate-950/10 via-slate-950/10 to-slate-950/85'
          : 'bg-gradient-to-b from-slate-950/5 via-slate-950/20 to-slate-950/90'
      }`}
    />
    <div className="relative flex h-full flex-col justify-between p-5 text-white">
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-white/90 backdrop-blur-sm">
          {featured ? `AI PICK ${rank}` : `추천 ${rank}`}
        </div>
        <RecommendationLikeButton
          isLiked={destination.isLiked}
          likeCount={destination.likeCount}
          onClick={() => onLikeToggle(destination.placeId, destination.isLiked)}
        />
      </div>
      <div className={featured ? 'max-w-[75%]' : 'max-w-[90%]'}>
        <h3
          className={
            featured
              ? 'text-[34px] font-black leading-tight'
              : 'text-[24px] font-black leading-tight'
          }
        >
          {destination.name}
        </h3>
        <p
          className={`mt-3 text-white/82 ${
            featured
              ? 'text-[14px] leading-7 line-clamp-3'
              : 'text-[13px] leading-6 line-clamp-2'
          }`}
        >
          {destination.description}
        </p>
      </div>
    </div>
  </article>
);

const PreferenceResultTile = ({
  destination,
  onLikeToggle,
}: {
  destination: RecommendedDestinationCard;
  onLikeToggle: (id: string, currentlyLiked: boolean) => void;
}) => (
  <article className="group relative h-[332px] w-[274px] shrink-0 overflow-hidden rounded-[14px]">
    <img
      src={destination.imageUrl}
      alt={destination.name}
      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
    <RecommendationLikeButton
      isLiked={destination.isLiked}
      likeCount={destination.likeCount}
      onClick={() => onLikeToggle(destination.placeId, destination.isLiked)}
    />
    <div className="absolute bottom-[21px] left-[21px] w-[240px] text-white">
      <div className="flex flex-col items-start gap-[10px]">
        <h3 className="line-clamp-1 text-[36px] font-medium leading-[36px]">
          {destination.name}
        </h3>
        <p className="line-clamp-3 text-[12px] font-normal leading-4 text-white/95">
          {destination.description}
        </p>
      </div>
    </div>
  </article>
);

const PreferenceSectionSkeleton = () => (
  <div className="grid gap-4 lg:grid-cols-[1.2fr_0.95fr]">
    <div className="h-[420px] animate-pulse rounded-[28px] bg-gradient-to-br from-sky-100 via-sky-50 to-white" />
    <div className="grid gap-4">
      <div className="h-[202px] animate-pulse rounded-[28px] bg-gradient-to-br from-slate-100 to-slate-50" />
      <div className="h-[202px] animate-pulse rounded-[28px] bg-gradient-to-br from-slate-100 to-slate-50" />
    </div>
  </div>
);

const PreferenceTileRowSkeleton = () => (
  <div className="flex gap-9 overflow-x-auto pb-2">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="h-[332px] w-[274px] shrink-0 animate-pulse rounded-[14px] bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50"
      />
    ))}
  </div>
);

export function HomePage({ initialUser }: HomePageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [selectedCountry, setSelectedCountry] = useState('JP');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [blogSortBy, setBlogSortBy] = useState<'latest' | 'popular'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [recommendedDestinations, setRecommendedDestinations] = useState<
    RecommendedDestinationCard[]
  >([]);
  const [isPolling, setIsPolling] = useState(false);

  const token = getAccessToken();
  const isLoggedIn = Boolean(token && token !== 'undefined');

  const { data: userProfile } = useQuery<UserResponse | null>({
    queryKey: ['current-user', token],
    queryFn: getMainPageUser,
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  const currentUser = userProfile || initialUser;
  const userName =
    currentUser?.profile?.name ?? (currentUser as any)?.name ?? '';

  const coursesQuery = useQuery({
    queryKey: ['main-courses', selectedCountry, sortBy, currentPage],
    queryFn: () =>
      getMainCourses({
        sortBy,
        countryCode: selectedCountry,
        page: currentPage,
        limit: 5,
      }),
  });

  const blogsQuery = useQuery({
    queryKey: ['main-blogs', blogSortBy],
    queryFn: () =>
      getMainBlogs({
        sortBy: blogSortBy,
        page: 1,
        limit: 6,
      }),
  });

  const visitedCountriesQuery = useQuery({
    queryKey: ['visited-countries-count'],
    queryFn: () => getMyVisitedCountries({ limit: 50 }),
    enabled: isLoggedIn,
  });

  const preferenceProfileQuery = useQuery<PreferenceResponse | null>({
    queryKey: ['my-preferences'],
    queryFn: async () => {
      try {
        return await getMyPreferences();
      } catch (error: any) {
        if (error?.statusCode === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: isLoggedIn,
    retry: false,
  });

  const preferenceProfile = normalizePreferenceProfile(
    preferenceProfileQuery.data,
  );
  const preferenceJobIdFromProfile = extractPreferenceJobId(
    preferenceProfileQuery.data,
  );
  const preferenceTags = preferenceProfile
    ? buildPreferenceTags(preferenceProfile).slice(0, 6)
    : [];

  const preferenceResultQuery = useQuery({
    queryKey: ['preference-result'],
    queryFn: async () => {
      try {
        return await getMyPreferenceResult();
      } catch (error: any) {
        if (error?.statusCode === 404) {
          return [];
        }
        throw error;
      }
    },
    enabled: isLoggedIn && Boolean(preferenceProfile),
    retry: false,
  });

  useEffect(() => {
    setRecommendedDestinations(
      extractNormalizedPreferenceRecommendations(preferenceResultQuery.data),
    );
  }, [preferenceResultQuery.data]);

  useEffect(() => {
    if (!preferenceProfile) {
      setRecommendedDestinations([]);
    }
  }, [preferenceProfile]);

  useEffect(() => {
    const state = location.state as { jobId?: string } | null;
    if (state?.jobId) {
      persistPreferenceJobId(state.jobId);
    }
  }, [location.state]);

  useEffect(() => {
    if (preferenceJobIdFromProfile) {
      persistPreferenceJobId(preferenceJobIdFromProfile);
    }
  }, [preferenceJobIdFromProfile]);

  useEffect(() => {
    let isCancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let isPollingComplete = false;
    let isPollingInFlight = false;

    const resolveJobIdToPoll = async () => {
      const state = location.state as { jobId?: string } | null;
      const candidateJobId =
        state?.jobId ||
        preferenceJobIdFromProfile ||
        readStoredPreferenceJobId();

      if (candidateJobId) {
        return candidateJobId;
      }

      try {
        const latestPreferenceResponse = await getMyPreferences();
        const latestJobId = extractPreferenceJobId(latestPreferenceResponse);

        if (latestJobId) {
          persistPreferenceJobId(latestJobId);
        }

        return latestJobId;
      } catch (error) {
        console.error('Failed to resolve preference job id:', error);
        return null;
      }
    };

    const pollOnce = async (jobIdToPoll: string): Promise<boolean> => {
      if (isPollingComplete || isPollingInFlight) {
        return true;
      }

      isPollingInFlight = true;

      try {
        const statusResponse = (await getPreferenceJobStatus(jobIdToPoll)) as any;
        const statusPayload =
          typeof statusResponse?.status === 'object'
            ? statusResponse.status
            : typeof statusResponse?.data?.status === 'object'
              ? statusResponse.data.status
              : typeof statusResponse?.result?.status === 'object'
                ? statusResponse.result.status
                : statusResponse?.data || statusResponse;
        const resolvedStatus =
          statusPayload?.status ||
          statusResponse?.status ||
          statusResponse?.data?.status ||
          statusResponse?.result?.status ||
          '';

        if (
          resolvedStatus === 'SUCCESS' ||
          resolvedStatus === 'COMPLETED'
        ) {
          isPollingComplete = true;
          if (timeoutId) clearTimeout(timeoutId);
          const resultData = await getPreferenceJobResult(jobIdToPoll);
          setRecommendedDestinations(
            extractNormalizedPreferenceRecommendations(resultData),
          );
          setIsPolling(false);
          return true;
        }

        if (resolvedStatus === 'FAILED') {
          isPollingComplete = true;
          if (timeoutId) clearTimeout(timeoutId);
          setIsPolling(false);
          return true;
        }

        return false;
      } catch (error) {
        isPollingComplete = true;
        if (timeoutId) clearTimeout(timeoutId);
        setIsPolling(false);
        console.error('Polling error:', error);
        return true;
      } finally {
        isPollingInFlight = false;
      }
    };

    const pollJob = async () => {
      const jobIdToPoll = await resolveJobIdToPoll();
      if (!jobIdToPoll || isCancelled) {
        setIsPolling(false);
        return;
      }

      setIsPolling(true);
      const isCompleted = await pollOnce(jobIdToPoll);

      if (isCompleted) {
        return;
      }

      timeoutId = setTimeout(async function runPolling() {
        const isCompleted = await pollOnce(jobIdToPoll);

        if (!isCompleted && !isCancelled) {
          timeoutId = setTimeout(runPolling, 30000);
        }
      }, 30000);
    };

    void pollJob();

    return () => {
      isCancelled = true;
      isPollingComplete = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    location.key,
    location.state,
    preferenceJobIdFromProfile,
  ]);

  const coursesData = (coursesQuery.data as any)?.data || coursesQuery.data;
  const destinations: Destination[] = (
    Array.isArray(coursesData)
      ? coursesData
      : coursesData?.courses || coursesData?.items || []
  ).map((c: any) => ({
    id: c.id,
    title: c.title,
    duration: c.start_date && c.end_date 
      ? `${Math.floor((new Date(c.end_date).getTime() - new Date(c.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1}일 일정`
      : '일정 정보 없음',
    description: c.description || `${c.title}와(과) 함께하는 여행`,
    tags: c.tags || [],
    imageUrl: c.imageUrl || 'https://images.pexels.com/photos/9782676/pexels-photo-9782676.jpeg',
    isLiked: c.is_liked ?? c.isLiked,
    is_liked: c.is_liked ?? c.isLiked,
    likeCount: c.like_count ?? c.likeCount,
    isMyPlan: (c.is_mine ?? c.is_owner ?? c.isMine ?? c.isOwner) || 
              (userName && c.userName && userName.trim().toLowerCase() === c.userName.trim().toLowerCase()),
    authorName: c.userName || c.authorName || c.author_name,
    isCompleted: c.is_completed ?? c.isCompleted,
  }));

  const paginationInfo = {
    total: coursesData?.total || 0,
    totalPages: coursesData?.totalPages || 0,
  };

  const blogsData = blogsQuery.data as any;
  const blogItems = Array.isArray(blogsData)
    ? blogsData
    : blogsData?.data?.blogs ||
      blogsData?.blogs ||
      blogsData?.data?.items ||
      blogsData?.items ||
      [];

  const feeds: FeedItem[] = blogItems.map((blog: any) => ({
    id: blog.id,
    author: blog.userName || '',
    date: blog.createdAt?.split('T')?.[0] || '',
    title: blog.title || '',
    content: blog.content || '',
    imageUrl:
      blog.imageUrl ||
      blog.imageUrls?.[0] ||
      'https://images.pexels.com/photos/9782676/pexels-photo-9782676.jpeg',
    likes: Number(blog.likeCount ?? 0),
    isLiked: Boolean(blog.isLiked),
  }));

  const visitedCountriesData =
    (visitedCountriesQuery.data as any)?.data || visitedCountriesQuery.data;
  const visitedCountriesCount = visitedCountriesData?.count || 0;
  const recentVisitedMarkers: GlobeProps['markers'] = (() => {
    const items: VisitedCountry[] = Array.isArray(visitedCountriesData?.items)
      ? visitedCountriesData.items
      : [];

    const recentCountries = items
      .slice()
      .sort((a, b) => getVisitedCountrySortDate(b) - getVisitedCountrySortDate(a))
      .filter((country, index, sorted) => {
        const normalized = normalizeCountryName(country.countryName);
        return (
          sorted.findIndex(
            (item) => normalizeCountryName(item.countryName) === normalized,
          ) === index
        );
      })
      .slice(0, 5);

    return recentCountries
      .map((country) => {
        const coordinates =
          COUNTRY_COORDINATES[normalizeCountryName(country.countryName)];
        if (!coordinates) return null;

        return {
          ...coordinates,
          label: country.countryName,
        };
      })
      .filter(Boolean) as NonNullable<GlobeProps['markers']>;
  })();

  const hasSavedPreferences = Boolean(preferenceProfile);
  const hasPreferenceRecommendations = recommendedDestinations.length > 0;
  const isPreferenceSectionLoading =
    isPolling ||
    preferenceProfileQuery.isLoading ||
    (hasSavedPreferences && preferenceResultQuery.isLoading);

  const handleRegionLikeToggle = async (
    id: string,
    currentlyLiked: boolean,
  ) => {
    try {
      setRecommendedDestinations((prev) =>
        prev.map((dest) =>
          dest.placeId === id ? { ...dest, isLiked: !currentlyLiked } : dest,
        ),
      );

      if (currentlyLiked) {
        await removeRegionLike(id);
      } else {
        await addRegionLike(id);
      }
    } catch (error) {
      console.error('Region Like failed', error);
      setRecommendedDestinations((prev) =>
        prev.map((dest) =>
          dest.placeId === id ? { ...dest, isLiked: currentlyLiked } : dest,
        ),
      );
    }
  };

  const handleCourseChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setCurrentPage(1);
  };

  const handlePreferenceSetupClick = () => {
    navigate('/survey');
  };

  const handleBlogMoreClick = () => {
    navigate(`/blogs?sortBy=${blogSortBy}&page=1`);
  };

  const handleActiveIdChange = (id: string) => {
    // No-op or update local display if needed
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ServiceEndNoticeModal />
      <Header isLoggedIn={isLoggedIn} />

      <main style={{ zoom: '0.85' }}>
        <section className="relative h-[400px] w-full overflow-hidden bg-black md:h-[500px]">
          <div className="absolute top-0 left-1/2 h-[900px] w-[900px] -translate-x-1/2 md:h-[1200px] md:w-[1200px]">
            <Globe
              className="[&>div:first-of-type]:!top-[13%]"
              onClick={
                isLoggedIn
                  ? () => navigate('/create-trip')
                  : () => navigate('/login')
              }
              markers={recentVisitedMarkers}
            />
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-8">
          <section className="mt-8 mb-4">
            <div className="mb-4">
              <h1
                style={{
                  ...typography.headline.LHeadlineM,
                  color: colors.gray[800],
                }}
              >
                안녕하세요 {userName}님
                <br />
                지금까지{' '}
                <span
                  style={{
                    ...typography.headline.LHeadlineM,
                    color: colors.primary[500],
                  }}
                >
                  {visitedCountriesCount}개국
                </span>
                을 여행했어요
              </h1>
            </div>
            <div className="mt-8 mb-20 h-[2px] w-1/4 rounded-full bg-gray-200" />
            <div className="flex flex-col gap-2">
              <h2 className="mb-2" style={{ ...typography.title.TitleM }}>
                모행 AI가 사용자에게
                <br />
                <span
                  style={{
                    ...typography.title.TitleB,
                    color: colors.primary[500],
                  }}
                >
                  딱!
                </span>{' '}
                맞는 여행지를 추천해드릴게요!
              </h2>
              <p style={{ ...typography.body.BodyM, color: colors.gray[400] }}>
                모행의 AI가 사용자님의 정보를 기반으로
                <br />
                추천하는 여행지입니다!
              </p>
            </div>
          </section>

          <section className="my-8">
            {preferenceTags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {preferenceTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12px] font-semibold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {!hasSavedPreferences && (
              <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-7">
                <p className="text-[14px] leading-7 text-slate-500">
                  저장된 선호도가 없습니다. 설문을 완료하면 이 영역에 추천 여행지가 카드 형태로 노출됩니다.
                </p>
                <button
                  type="button"
                  onClick={handlePreferenceSetupClick}
                  className="mt-5 inline-flex items-center rounded-full border border-sky-200 px-5 py-3 text-[13px] font-bold text-sky-600 transition hover:border-sky-300 hover:bg-sky-50"
                >
                  취향 설문 시작하기
                </button>
              </div>
            )}

            {hasSavedPreferences && isPreferenceSectionLoading && (
              <PreferenceTileRowSkeleton />
            )}

            {hasSavedPreferences &&
              !isPreferenceSectionLoading &&
              hasPreferenceRecommendations && (
                <div className="flex gap-9 overflow-x-auto pb-2">
                  {recommendedDestinations.map((destination) => (
                    <PreferenceResultTile
                      key={destination.placeId}
                      destination={destination}
                      onLikeToggle={handleRegionLikeToggle}
                    />
                  ))}
                </div>
              )}

            {hasSavedPreferences &&
              !isPreferenceSectionLoading &&
              !hasPreferenceRecommendations && (
                <div className="px-6 py-7 text-center">
                  <p className="text-center text-gray-400">
                    표시할 여행지가 없습니다.
                  </p>
                </div>
              )}
          </section>

          <section className="hidden my-8">
            <div className="overflow-hidden rounded-[36px] border border-sky-100 bg-white px-6 py-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:px-8 md:py-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold tracking-[0.2em] text-sky-600">
                      MOHAENG CURATION
                    </div>
                    <h3 className="mt-4 text-[28px] font-black leading-tight text-slate-900 md:text-[34px]">
                      저장된 선호도를 바탕으로
                      <br />
                      맞춤 추천 여행지를 준비했어요
                    </h3>
                    <p className="mt-3 text-[14px] leading-7 text-slate-500 md:text-[15px]">
                      현재는 추천 결과 API가 빈 값을 주는 상태라서, 데이터가 정상화되면 이
                      영역에 바로 카드가 채워지도록 홈 전용 레이아웃을 먼저 연결해뒀습니다.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handlePreferenceSetupClick}
                    className="inline-flex items-center justify-center rounded-full border border-sky-200 px-5 py-3 text-[13px] font-bold text-sky-600 transition hover:border-sky-300 hover:bg-sky-50"
                  >
                    취향 다시 설정하기
                  </button>
                </div>

                {preferenceTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {preferenceTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12px] font-semibold text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {!hasSavedPreferences && (
                  <div className="rounded-[30px] bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 p-8 text-white">
                    <p className="text-[12px] font-bold tracking-[0.18em] text-sky-200">
                      START PERSONALIZATION
                    </p>
                    <h4 className="mt-4 text-[28px] font-black leading-tight">
                      아직 저장된 선호도가 없어요.
                    </h4>
                    <p className="mt-3 max-w-xl text-[14px] leading-7 text-white/78">
                      취향 설문을 완료하면 홈에서 바로 추천 여행지를 받아볼 수 있게
                      연결해뒀습니다.
                    </p>
                    <button
                      type="button"
                      onClick={handlePreferenceSetupClick}
                      className="mt-6 inline-flex items-center rounded-full bg-white px-5 py-3 text-[13px] font-bold text-slate-900 transition hover:bg-sky-50"
                    >
                      설문 시작하기
                    </button>
                  </div>
                )}

                {hasSavedPreferences && isPreferenceSectionLoading && (
                  <div>
                    <div className="mb-4 flex items-center gap-3 text-[13px] font-semibold text-sky-600">
                      <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-sky-400" />
                      추천 결과를 불러오는 중입니다.
                    </div>
                    <PreferenceSectionSkeleton />
                  </div>
                )}

                {hasSavedPreferences &&
                  !isPreferenceSectionLoading &&
                  hasPreferenceRecommendations && (
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.95fr]">
                      <PreferenceRecommendationCard
                        destination={recommendedDestinations[0]}
                        rank={1}
                        featured
                        onLikeToggle={handleRegionLikeToggle}
                      />
                      <div className="grid gap-4">
                        {recommendedDestinations.slice(1, 3).map((destination, index) => (
                          <PreferenceRecommendationCard
                            key={destination.placeId}
                            destination={destination}
                            rank={index + 2}
                            onLikeToggle={handleRegionLikeToggle}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                {hasSavedPreferences &&
                  !isPreferenceSectionLoading &&
                  !hasPreferenceRecommendations && (
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.95fr]">
                      <div className="rounded-[30px] bg-gradient-to-br from-slate-950 via-slate-900 to-sky-900 p-8 text-white">
                        <p className="text-[12px] font-bold tracking-[0.18em] text-sky-200">
                          CURATION READY
                        </p>
                        <h4 className="mt-4 text-[30px] font-black leading-tight">
                          결과 값이 정상화되면
                          <br />
                          이 영역에 대표 추천이 먼저 노출됩니다.
                        </h4>
                        <p className="mt-4 max-w-lg text-[14px] leading-7 text-white/78">
                          현재 `result` 응답이 null이라 카드 데이터는 비어 있지만, 홈에서는
                          저장된 선호도와 추천 레이아웃을 먼저 연결해뒀습니다.
                        </p>
                      </div>
                      <div className="grid gap-4">
                        <div className="rounded-[30px] border border-dashed border-slate-200 bg-slate-50 p-6">
                          <p className="text-[12px] font-bold tracking-[0.18em] text-slate-400">
                            SECONDARY CARD
                          </p>
                          <div className="mt-6 h-6 w-2/3 rounded-full bg-slate-200" />
                          <div className="mt-3 h-4 w-full rounded-full bg-slate-100" />
                          <div className="mt-2 h-4 w-5/6 rounded-full bg-slate-100" />
                        </div>
                        <div className="rounded-[30px] border border-dashed border-slate-200 bg-slate-50 p-6">
                          <p className="text-[12px] font-bold tracking-[0.18em] text-slate-400">
                            THIRD CARD
                          </p>
                          <div className="mt-6 h-6 w-1/2 rounded-full bg-slate-200" />
                          <div className="mt-3 h-4 w-full rounded-full bg-slate-100" />
                          <div className="mt-2 h-4 w-4/6 rounded-full bg-slate-100" />
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </section>

          <section className="hidden my-8 overflow-hidden">
            <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {isPolling && (
                <div className="flex w-full items-center justify-center py-10">
                  <p
                    style={{
                      ...typography.body.LBodyM,
                      color: colors.primary[500],
                    }}
                  >
                    사용자님께 딱 맞는 여행지를 찾는 중입니다...
                  </p>
                </div>
              )}

              {!isPolling && preferenceResultQuery.isLoading && (
                <div className="flex w-full items-center justify-center py-10">
                  <p
                    style={{
                      ...typography.body.LBodyM,
                      color: colors.gray[400],
                    }}
                  >
                    추천 여행지를 불러오는 중입니다...
                  </p>
                </div>
              )}

              {!isPolling &&
                !preferenceResultQuery.isLoading &&
                recommendedDestinations.length > 0 &&
                recommendedDestinations.map((dest) => (
                  <TravelCard
                    key={dest.placeId}
                    id={dest.placeId}
                    imageUrl={dest.imageUrl}
                    title={dest.name}
                    description={dest.description}
                    isLiked={dest.isLiked}
                    onLikeToggle={handleRegionLikeToggle}
                  />
                ))}

              {!isPolling &&
                !preferenceResultQuery.isLoading &&
                recommendedDestinations.length === 0 && (
                  <div className="flex w-full items-center justify-center py-10">
                    <p
                      style={{
                        ...typography.body.LBodyM,
                        color: colors.gray[400],
                      }}
                    >
                      아직 추천 여행지 결과가 없습니다.
                    </p>
                  </div>
                )}
            </div>
          </section>

          <section className="mt-20">
            <CourseSection onCourseChange={handleCourseChange} />
            
            {/* 정렬 버튼 */}
            <div className="flex gap-4 mb-6 -mt-2 px-1">
              <button
                onClick={() => setSortBy('latest')}
                className={`text-sm font-bold transition-all flex items-center gap-1.5 ${
                  sortBy === 'latest' 
                    ? 'text-[#00CCFF]' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${sortBy === 'latest' ? 'bg-[#00CCFF]' : 'bg-transparent'}`} />
                최신순
              </button>
              <div className="w-px h-3 bg-gray-200 self-center" />
              <button
                onClick={() => setSortBy('popular')}
                className={`text-sm font-bold transition-all flex items-center gap-1.5 ${
                  sortBy === 'popular' 
                    ? 'text-[#00CCFF]' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${sortBy === 'popular' ? 'bg-[#00CCFF]' : 'bg-transparent'}`} />
                인기순
              </button>
            </div>

            <DestinationList
              destinations={destinations}
              feeds={feeds}
              onLikeError={(message) => showAlert(message, 'error')}
              page={currentPage}
              totalPages={paginationInfo.totalPages}
              onPageChange={setCurrentPage}
              onActiveIdChange={handleActiveIdChange}
              isLoading={coursesQuery.isLoading}
            />
          </section>

          <section className="pb-16">
            <BlogList selectedSort={blogSortBy} onBlogChange={setBlogSortBy} />
            {blogsQuery.isLoading ? (
              <div className="py-10 text-center text-sm text-gray-400">
                블로그 목록을 불러오는 중입니다...
              </div>
            ) : (
              <>
                <FeedGrid
                  feeds={feeds}
                  showMoreButton={false}
                  onLikeError={(message) => showAlert(message, 'error')}
                />
                {feeds.length > 0 ? (
                  <div className="mt-10 flex justify-center">
                    <button
                      type="button"
                      onClick={handleBlogMoreClick}
                      className="rounded-full border-2 border-[#00c7f2] px-7 py-2.5 text-[#00c7f2] transition-all hover:bg-[#00c7f2] hover:text-white"
                      style={{
                        ...typography.body.BodyM,
                      }}
                    >
                      더보러가기
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </section>
        </div>
      </main>

      <FloatingActionButton
        onClick={
          isLoggedIn ? () => navigate('/create-trip') : () => navigate('/login')
        }
      />
    </div>
  );
}

export default HomePage;

