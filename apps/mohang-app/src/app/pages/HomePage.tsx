import { useLocation, useNavigate } from 'react-router-dom';
import { colors, typography } from '@mohang/ui';
import { useState, useEffect } from 'react';
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
  addLike,
  removeLike,
  getMainBlogs,
  getMyVisitedCountries,
  getMainPageUser,
  getMyPreferenceResult,
  getPreferenceJobStatus,
  getPreferenceJobResult,
  addRegionLike,
  removeRegionLike,
  PreferenceRecommendation,
  LoadingScreen,
} from '@mohang/ui';
import { UserResponse } from '@mohang/ui';

interface HomePageProps {
  initialUser?: UserResponse | null;
  onUserLoaded?: (user: UserResponse) => void;
}

interface RecommendedDestinationCard {
  placeId: string;
  name: string;
  description: string;
  imageUrl: string;
  isLiked: boolean;
}

const mapPreferenceRecommendation = (
  item: PreferenceRecommendation,
): RecommendedDestinationCard => ({
  placeId: item.regionId || item.regionName,
  name: item.regionName,
  description: item.description || '추천 여행지 설명이 아직 준비되지 않았습니다.',
  imageUrl:
    item.imageUrl ||
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800',
  isLiked: item.isLiked ?? false,
});

export function HomePage({ initialUser, onUserLoaded }: HomePageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [Feeds, setFeeds] = useState<FeedItem[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(initialUser ?? null);
  const [selectedCountry, setSelectedCountry] = useState('JP');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    totalPages: 0,
  });
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [recommendedDestinations, setRecommendedDestinations] = useState<
    RecommendedDestinationCard[]
  >([]);
  const [visitedCountriesCount, setVisitedCountriesCount] = useState<number>(0);
  const [isPolling, setIsPolling] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isCoursesLoading, setIsCoursesLoading] = useState(false);
  const userName = user?.profile?.name ?? (user as any)?.name ?? '';

  useEffect(() => {
    const init = async () => {
      if (!isInitialLoading) {
        setIsCoursesLoading(true);
      }

      const token = getAccessToken();
      const isAuthed = Boolean(token && token !== 'undefined');
      setIsLoggedIn(isAuthed);

      try {
        const fetchTasks: Promise<any>[] = [
          getMainCourses({
            countryCode: selectedCountry,
            page: currentPage,
            limit: 10,
          }),
          getMainBlogs(),
        ];

        if (isAuthed) {
          fetchTasks.push(getMainPageUser());
          fetchTasks.push(getMyVisitedCountries());
          fetchTasks.push(getMyPreferenceResult());
        }

        const results = await Promise.all(fetchTasks);

        const mainCoursesRes = results[0];
        const blogsRes = results[1];

        const courseData = mainCoursesRes.data || mainCoursesRes;
        const destinationsArray = Array.isArray(courseData)
          ? courseData
          : courseData.courses || courseData.items || [];
        setDestinations(destinationsArray);

        setPaginationInfo({
          total: courseData.total || 0,
          totalPages: courseData.totalPages || 0,
        });

        const blogsData = blogsRes.data || blogsRes;
        const feedsArray = Array.isArray(blogsData)
          ? blogsData
          : blogsData.blogs || blogsData.items || [];
        setFeeds(feedsArray);

        if (isAuthed) {
          const userRes = results[2];
          const userData = userRes.data || userRes;
          setUser(userData);

          const visitedCountriesRes = results[3];
          const visitedCountriesData =
            visitedCountriesRes.data || visitedCountriesRes;
          setVisitedCountriesCount(visitedCountriesData.count || 0);

          const preferenceResultRes = results[4];
          const preferenceResultData =
            preferenceResultRes.data || preferenceResultRes;
          setRecommendedDestinations(
            Array.isArray(preferenceResultData)
              ? preferenceResultData.map(mapPreferenceRecommendation)
              : [],
          );

          if (onUserLoaded) {
            onUserLoaded(userData);
          }
        }
      } catch (error) {
        console.error('INIT ERROR:', error);
      } finally {
        setIsInitialLoading(false);
        setIsCoursesLoading(false);
      }
    };

    init();
  }, [selectedCountry, currentPage]);

  useEffect(() => {
    const fetchUserCourses = async () => {
      if (!user) return;
      try {
        const coursesData = user as any;

        if (coursesData.myRoadmaps) {
          console.log(coursesData, 'User data containing roadmaps');
        }
      } catch (error) {
        console.error('fetchUserCourses ERROR:', error);
      }
    };
    fetchUserCourses();
  }, [user, currentPage]);

  useEffect(() => {
    const state = location.state as { jobId?: string };
    if (!state?.jobId) {
      console.log('No jobId found in location state');
      return;
    }

    console.log('Detected jobId for polling:', state.jobId);

    const pollJob = async () => {
      setIsPolling(true);
      const interval = setInterval(async () => {
        try {
          const statusRes = await getPreferenceJobStatus(state.jobId!);
          const statusData = (statusRes as any).data || statusRes;
          console.log('Job status check (30s):', statusData.status);

          if (statusData.status === 'SUCCESS') {
            clearInterval(interval);
            const resultRes = await getPreferenceJobResult(state.jobId!);
            const resultData = (resultRes as any).data || resultRes;
            setRecommendedDestinations(
              Array.isArray(resultData)
                ? resultData.map(mapPreferenceRecommendation)
                : [],
            );
            setIsPolling(false);
            console.log('Recommendation result loaded:', resultData);
          } else if (statusData.status === 'FAILED') {
            clearInterval(interval);
            setIsPolling(false);
            console.error('Job failed:', statusData.errorMessage);
          }
        } catch (error) {
          clearInterval(interval);
          setIsPolling(false);
          console.error('Polling error:', error);
        }
      }, 30000);

      return () => clearInterval(interval);
    };

    pollJob();
  }, [location.state]);

  const handleToggleLike = async () => {
    if (!selectedCourseId) return;
    try {
      await (isLiked
        ? removeLike(selectedCourseId)
        : addLike(selectedCourseId));
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Like failed', error);
    }
  };

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
      alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCourseChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleActiveIdChange = (id: string) => {
    setSelectedCourseId(id);
    const currentCourse = destinations.find((d) => d.id === id);
    if (currentCourse) {
      setIsLiked(currentCourse.isLiked ?? false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ zoom: '0.85' }}>
      <Header isLoggedIn={isLoggedIn} />
      {isInitialLoading && (
        <LoadingScreen
          message="여행 정보를 불러오고 있습니다"
          description="잠시만 기다려주세요"
        />
      )}
      <main>
        <section className="w-full h-[400px] md:h-[500px] overflow-hidden bg-black relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] md:w-[1200px] md:h-[1200px]">
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

        <div className="max-w-7xl mx-auto px-8">
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
            <div className="w-1/4 h-[2px] bg-gray-200 mt-8 mb-20 rounded-full" />
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
                <div className="flex items-center justify-center w-full py-10">
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

              {!isPolling && recommendedDestinations.length > 0
                ? recommendedDestinations.map((dest) => (
                    <TravelCard
                      key={dest.placeId}
                      id={dest.placeId}
                      imageUrl={dest.imageUrl}
                      title={dest.name}
                      description={dest.description}
                      isLiked={dest.isLiked}
                      onLikeToggle={handleRegionLikeToggle}
                    />
                  ))
                : !isPolling && (
                    <div className="flex items-center justify-center w-full py-10">
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
              feeds={Feeds}
              onAddLike={handleToggleLike}
              page={currentPage}
              totalPages={paginationInfo.totalPages}
              onPageChange={handlePageChange}
              onActiveIdChange={handleActiveIdChange}
              isLoading={isCoursesLoading}
            />
          </section>

          <section className="pb-16">
            <BlogList />
            <FeedGrid feeds={Feeds} />
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
