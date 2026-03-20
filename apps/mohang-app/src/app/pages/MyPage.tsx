import { MyPage as MyPageComponent, Header, UserResponse } from '@mohang/ui';
import { useNavigate } from 'react-router-dom';
import { FeedItem, clearTokens } from '@mohang/ui';
import { useEffect, useState } from 'react';
import {
  getMyRoadmaps,
  getMyTravelLogs,
  getMyLikedRoadmaps,
  getMyLikedTravelLogs,
  getMyLikedRegions,
  LoadingScreen,
} from '@mohang/ui';

interface MyPageProps {
  initialUser?: UserResponse | null;
}

export function MyPage({ initialUser }: MyPageProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserResponse | null>(initialUser ?? null);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(initialUser));
  const [myRoadmaps, setMyRoadmaps] = useState<any>([]);
  const [myTravelLogs, setMyTravelLogs] = useState<any>([]);
  const [myLikedRoadmaps, setMyLikedRoadmaps] = useState<any>([]);
  const [myLikedTravelLogs, setMyLikedTravelLogs] = useState<any>([]);
  const [myLikedRegions, setMyLikedRegions] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      const fetchList = async (fetcher: any, setter: any, type: string) => {
        try {
          const response = await fetcher(1, 10);
          console.log(`Fetched ${type} data:`, response);
          const data =
            response.data?.courses ||
            response.courses ||
            response.data?.items ||
            response.items ||
            [];
          setter(data);
        } catch (error) {
          console.error(`Error fetching ${type}:`, error);
        }
      };

      try {
        await Promise.all([
          fetchList(getMyRoadmaps, setMyRoadmaps, 'roadmaps'),
          fetchList(getMyTravelLogs, setMyTravelLogs, 'travel-logs'),
          fetchList(getMyLikedRoadmaps, setMyLikedRoadmaps, 'liked-roadmaps'),
          fetchList(
            getMyLikedTravelLogs,
            setMyLikedTravelLogs,
            'liked-travel-logs',
          ),
          fetchList(getMyLikedRegions, setMyLikedRegions, 'liked-regions'),
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // API response mapping to MyPage component's expected 'user' prop format
  const userData = user
    ? {
        name: user.profile?.name || (user as any).name,
        email: user.profile?.email || (user as any).email,
        totalTrips:
          user.stats?.createdRoadmaps ?? (user as any).totalTrips ?? 0,
        totalCountries:
          user.stats?.visitedCountries ?? (user as any).totalCountries ?? 0,
        diaryCount: user.stats?.writtenBlogs ?? (user as any).diaryCount ?? 0,
        likedCount:
          user.stats?.likedRegions ?? (user as any).bookmarkCount ?? 0,
      }
    : null;
  console.log(userData, 'userData');

  const chunkArray = (arr: any[], size: number) => {
    const chunked = [];
    for (let i = 0; i < arr.length; i += size) {
      chunked.push(arr.slice(i, i + size));
    }
    return chunked;
  };

  const mapDestinations = (items: any[]) =>
    (items || []).map((item: any) => {
      const data = item.data || item;
      return {
        id: item.id || item.courseId || data.id,
        title: data.title || '',
        duration:
          data.start_date && data.end_date
            ? `${data.start_date} ~ ${data.end_date}`
            : data.trip_days
              ? `${data.trip_days}일 일정`
              : data.days
                ? `${data.days}일 일정`
                : '',
        tags: data.tags || data.hashTags || [],
        description: data.summary?.description || data.description || '',
        imageUrl: data.imageUrl || item.imageUrl || '',
      };
    });

  const mapTravelLogs = (items: any[]) =>
    (items || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      imageUrl: item.imageUrl,
      likeCount: item.likeCount,
      isLiked: item.isLiked,
      createdAt: item.createdAt,
    }));

  const userDestinations = chunkArray(mapDestinations(myRoadmaps as any[]), 3);
  const userTravelLogs = chunkArray(mapTravelLogs(myTravelLogs as any[]), 3);
  const userLikedTravelLogs = chunkArray(
    mapTravelLogs(myLikedTravelLogs as any[]),
    3,
  );

  const sampleFeeds: FeedItem[] = [
    {
      id: '1',
      author: '손희찬',
      date: '2025.5.5',
      title: '일본 여행중 레전드 사건 발생',
      content:
        '제가 친구랑 일본 여행을 갔었는데요.. 진짜 대박적인 일이 발생해서 공유해봅니다. 도쿄 시부야 한복판에서...',
      imageUrl:
        'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1000', // 시부야 거리
      likes: 1002,
      // avatarUrl이 없으면 컴포넌트에서 기본 갈색 배경이 나오도록 설정 가능
    },
    {
      id: '2',
      author: '김민수',
      date: '2025.5.10',
      title: '오사카 먹방 리스트 대공개',
      content:
        '이번 오사카 여행에서 먹었던 것 중 베스트 5를 뽑아봤습니다. 도톤보리 구석에 숨겨진 라멘집은 정말...',
      imageUrl:
        'https://images.unsplash.com/photo-1590233641133-3610067e8f4c?q=80&w=1000', // 음식/시장
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minsu', // 랜덤 아바타 예시
      likes: 854,
    },
    {
      id: '3',
      author: '이지원',
      date: '2025.5.15',
      title: '교토 감성 숙소 내돈내산 후기',
      content:
        '조용하고 고즈넉한 분위기를 원하신다면 이 숙소를 강력 추천드려요. 아침에 눈 떴을 때 창밖 정원 뷰가...',
      imageUrl:
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000', // 교토 풍경
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jiwon',
      likes: 1205,
    },
    {
      id: '4',
      author: '이지원',
      date: '2025.5.15',
      title: '교토 감성 숙소 내돈내산 후기',
      content:
        '조용하고 고즈넉한 분위기를 원하신다면 이 숙소를 강력 추천드려요. 아침에 눈 떴을 때 창밖 정원 뷰가...',
      imageUrl:
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000', // 교토 풍경
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jiwon',
      likes: 1205,
    },
  ];

  const handleAction = (type: string) => {
    console.log(`${type} 실행`);
    if (type === 'logout') {
      clearTokens();
      navigate('/login');
    }
  };

  if (isLoading || !userData) {
    return (
      <LoadingScreen
        message="마이페이지를 불러오는 중"
        description="잠시만 기다려주세요"
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header isLoggedIn={isLoggedIn} />
      <MyPageComponent
        userName={userData.name}
        feeds={sampleFeeds}
        destinations={userDestinations}
        travelLogs={userTravelLogs}
        likedRoadmaps={myLikedRoadmaps}
        likedTravelLogs={userLikedTravelLogs}
        likedRegions={myLikedRegions}
        user={userData}
        onAction={handleAction}
      />
    </div>
  );
}

export default MyPage;
