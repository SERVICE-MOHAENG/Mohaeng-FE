import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { colors, typography } from '@mohang/ui';
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
  getMyPreferenceResult,
  getPreferenceJobStatus,
  getPreferenceJobResult,
  addRegionLike,
  removeRegionLike,
  PreferenceRecommendation,
  UserResponse,
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
}

const FALLBACK_REGION_IMAGE =
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800';

const mapPreferenceRecommendation = (
  item: PreferenceRecommendation,
): RecommendedDestinationCard => ({
  placeId: item.regionId || item.regionName,
  name: item.regionName,
  description: item.description || '추천 여행지 설명이 아직 준비되지 않았습니다.',
  imageUrl: item.imageUrl || FALLBACK_REGION_IMAGE,
  isLiked: item.isLiked ?? false,
});

export function HomePage({ initialUser }: HomePageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState('JP');
  const [sortBy] = useState<'latest' | 'popular'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [recommendedDestinations, setRecommendedDestinations] = useState<
    RecommendedDestinationCard[]
  >([]);
  const [isPolling, setIsPolling] = useState(false);

  const token = getAccessToken();
  const isLoggedIn = Boolean(token && token !== 'undefined');
  const userName =
    initialUser?.profile?.name ?? (initialUser as any)?.name ?? '';

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
    queryKey: ['main-blogs'],
    queryFn: getMainBlogs,
  });

  const visitedCountriesQuery = useQuery({
    queryKey: ['visited-countries-count'],
    queryFn: () => getMyVisitedCountries(),
    enabled: isLoggedIn,
  });

  const preferenceResultQuery = useQuery({
    queryKey: ['preference-result'],
    queryFn: () => getMyPreferenceResult(),
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (!preferenceResultQuery.data) return;
    setRecommendedDestinations(
      Array.isArray(preferenceResultQuery.data)
        ? preferenceResultQuery.data.map(mapPreferenceRecommendation)
        : [],
    );
  }, [preferenceResultQuery.data]);

  useEffect(() => {
    const state = location.state as { jobId?: string } | null;
    if (!state?.jobId) return;

    let intervalId: ReturnType<typeof setInterval> | undefined;

    const pollJob = async () => {
      setIsPolling(true);

      intervalId = setInterval(async () => {
        try {
          const statusData = await getPreferenceJobStatus(state.jobId!);

          if (statusData.status === 'SUCCESS' || statusData.status === 'COMPLETED') {
            if (intervalId) clearInterval(intervalId);
            const resultData = await getPreferenceJobResult(state.jobId!);
            setRecommendedDestinations(
              Array.isArray(resultData)
                ? resultData.map(mapPreferenceRecommendation)
                : [],
            );
            setIsPolling(false);
          } else if (statusData.status === 'FAILED') {
            if (intervalId) clearInterval(intervalId);
            setIsPolling(false);
          }
        } catch (error) {
          if (intervalId) clearInterval(intervalId);
          setIsPolling(false);
          console.error('Polling error:', error);
        }
      }, 30000);
    };

    pollJob();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [location.state]);

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
    imageUrl: c.imageUrl || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800',
    isLiked: c.is_liked ?? c.isLiked,
    is_liked: c.is_liked ?? c.isLiked,
    likeCount: c.like_count ?? c.likeCount,
  }));

  const paginationInfo = {
    total: coursesData?.total || 0,
    totalPages: coursesData?.totalPages || 0,
  };

  const blogsData = (blogsQuery.data as any)?.data || blogsQuery.data;
  const feeds: FeedItem[] = Array.isArray(blogsData)
    ? blogsData
    : blogsData?.blogs || blogsData?.items || [];

  const visitedCountriesData =
    (visitedCountriesQuery.data as any)?.data || visitedCountriesQuery.data;
  const visitedCountriesCount = visitedCountriesData?.count || 0;

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

  const handleActiveIdChange = (id: string) => {
    // No-op or update local display if needed, but per-item heart is handled inside DestinationList
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                맞는 여행지를 찾았어요!
              </h2>
              <p style={{ ...typography.body.BodyM, color: colors.gray[400] }}>
                모행의 AI가 사용자님의 정보를 기반으로
                <br />
                추천하는 해외 여행지입니다!
              </p>
            </div>
          </section>

          <section className="my-8 overflow-hidden">
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
            <DestinationList
              destinations={destinations}
              feeds={feeds}
              page={currentPage}
              totalPages={paginationInfo.totalPages}
              onPageChange={setCurrentPage}
              onActiveIdChange={handleActiveIdChange}
              isLoading={coursesQuery.isLoading}
            />
          </section>

          <section className="pb-16">
            <BlogList />
            {blogsQuery.isLoading ? (
              <div className="py-10 text-center text-sm text-gray-400">
                블로그 목록을 불러오는 중입니다...
              </div>
            ) : (
              <FeedGrid feeds={feeds} />
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
