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
  getMyLikedCourses,
  addLike,
  removeLike,
  getMainBlogs,
  getMyVisitedCountries,
  getMainPageUser,
  getMyPreferences,
  getPreferenceJobStatus,
  getPreferenceJobResult,
  RecommendedDestination,
  LoadingScreen,
} from '@mohang/ui';
import { UserResponse } from '@mohang/ui';

interface HomePageProps {
  initialUser?: UserResponse | null;
  onUserLoaded?: (user: UserResponse) => void;
}

// 샘플 이미지 URL
const JAPAN_IMAGE =
  'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800';
const PARIS_IMAGE =
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800';
const NEWYORK_IMAGE =
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800';
const LONDON_IMAGE =
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800';
const BALI_IMAGE =
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800';

export function HomePage({ initialUser, onUserLoaded }: HomePageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [Feeds, setFeeds] = useState<FeedItem[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(initialUser ?? null);
  const [totalCountries, setTotalCountries] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('JP');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    totalPages: 0,
  });
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [recommendedDestinations, setRecommendedDestinations] = useState<
    RecommendedDestination[]
  >([]);
  const [isPolling, setIsPolling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
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
          getMyPreferences(),
        ];

        if (isAuthed) {
          fetchTasks.push(getMainPageUser());
          fetchTasks.push(getMyLikedCourses({ page: currentPage, limit: 10 }));
          fetchTasks.push(getMyVisitedCountries());
        }

        const results = await Promise.all(fetchTasks);

        const mainCoursesRes = results[0];
        const blogsRes = results[1];
        // results[2] is getMyPreferences

        const mainCourses = mainCoursesRes.data || (mainCoursesRes as any);
        setDestinations(mainCourses.courses || mainCourses.items || []);
        setPaginationInfo({
          total: mainCourses.total || 0,
          totalPages: mainCourses.totalPages || 0,
        });
        setFeeds(blogsRes.data.items || []);

        if (isAuthed) {
          const userRes = results[3];
          const userData = (userRes as any).data;
          setUser(userData);
          if (onUserLoaded) {
            onUserLoaded(userData);
          }
        }
      } catch (error) {
        console.error('INIT ERROR:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [selectedCountry, currentPage]);

  useEffect(() => {
    const fetchUserCourses = async () => {
      if (!user) return;
      try {
        // user already has the data if it was fetched in the first useEffect
        // or if it was passed as initialUser.
        // If getMainPageUser returns myRoadmaps, we can use it from the user state.
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

  // Removed local getMyPreferences effect as it's now part of the main init Promise.all

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

          if (statusData.status === 'COMPLETED') {
            clearInterval(interval);
            const resultRes = await getPreferenceJobResult(state.jobId!);
            const resultData = (resultRes as any).data || resultRes;
            setRecommendedDestinations(resultData.destinations || []);
            setIsPolling(false);
            console.log(
              'Recommendation result loaded:',
              resultData.destinations,
            );
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
      }, 30000); // 30 seconds interval

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

  const handleCourseChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleActiveIdChange = (id: string) => {
    setSelectedCourseId(id);
    // Sync local toggle states with the newly selected course data if available
    const currentCourse = destinations.find((d) => d.id === id);
    if (currentCourse) {
      setIsBookmarked(currentCourse.isBookmarked ?? false);
      setIsLiked(currentCourse.isLiked ?? false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ zoom: '0.85' }}>
      <Header isLoggedIn={isLoggedIn} />
      {isLoading && (
        <LoadingScreen
          message="여행 정보를 불러오고 있습니다"
          description="잠시만 기다려주세요"
        />
      )}
      <main>
        <section className="w-full">
          <Globe
            onClick={
              isLoggedIn
                ? () => navigate('/create-trip')
                : () => navigate('/login')
            }
          />
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
                안녕하세요 {user?.profile.name}님
                <br />
                지금까지{' '}
                <span
                  style={{
                    ...typography.headline.LHeadlineM,
                    color: colors.primary[500],
                  }}
                >
                  {user?.stats.visitedCountries}개국
                </span>
                을 여행했어요
              </h1>
            </div>
            <div className="w-1/4 h-[2px] bg-gray-200 mt-8 mb-20 rounded-full" />
            <div className="flex flex-col gap-2">
              <h2
                className="mb-2"
                style={{ ...typography.title.TitleM, fontFamily: 'Paperozi' }}
              >
                모행 AI가 사용자에게 <br />
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
                    사용자님의 취향에 맞는 여행지를 찾는 중입니다... (30초마다
                    확인)
                  </p>
                </div>
              )}

              {!isPolling && recommendedDestinations.length > 0
                ? recommendedDestinations.map((dest) => (
                    <TravelCard
                      key={dest.placeId}
                      imageUrl={dest.imageUrl}
                      title={dest.name}
                      description={dest.description}
                    />
                  ))
                : !isPolling && (
                    <>
                      <TravelCard
                        imageUrl={JAPAN_IMAGE}
                        title="일본 도쿄"
                        description="전통과 현대가 공존하는 일본의 수도. 시부야, 신주쿠, 아키하바라 등 다채로운 명소와 맛있는 스시, 라멘을 즐길 수 있는 도시"
                      />
                      <TravelCard
                        imageUrl={PARIS_IMAGE}
                        title="프랑스 파리"
                        description="낭만의 도시 파리. 에펠탑, 루브르 박물관, 개선문 등 유명한 랜드마크와 세느강을 따라 펼쳐진 아름다운 풍경이 매력적인 곳"
                      />
                      <TravelCard
                        imageUrl={NEWYORK_IMAGE}
                        title="미국 뉴욕"
                        description="잠들지 않는 도시. 자유의 여신상, 타임스퀘어, 센트럴파크 등 상징적인 명소와 브로드웨이 뮤지컬, 다양한 문화가 공존하는 대도시"
                      />
                      <TravelCard
                        imageUrl={LONDON_IMAGE}
                        title="영국 런던"
                        description="역사와 전통이 살아있는 도시. 빅벤, 런던아이, 버킹엄 궁전 등 유서 깊은 건축물과 세계적인 박물관들이 가득한 문화의 중심지"
                      />
                      <TravelCard
                        imageUrl={BALI_IMAGE}
                        title="인도네시아 발리"
                        description="신들의 섬 발리. 아름다운 해변과 계단식 논, 힌두 사원들이 어우러진 열대 낙원. 서핑과 요가, 스파를 즐기기에 완벽한 휴양지"
                      />
                    </>
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
