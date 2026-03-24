import { MyPage as MyPageComponent, Header, UserResponse } from '@mohang/ui';
import { useNavigate } from 'react-router-dom';
import { FeedItem, clearTokens, getAccessToken } from '@mohang/ui';
import { useEffect, useMemo, useState } from 'react';
import {
  getMyRoadmaps,
  getMyTravelLogs,
  getMyLikedRoadmaps,
  getMyLikedTravelLogs,
  getMyLikedRegions,
} from '@mohang/ui';

interface MyPageProps {
  initialUser?: UserResponse | null;
}

export function MyPage({ initialUser }: MyPageProps) {
  const navigate = useNavigate();
  const token = getAccessToken();
  const isLoggedIn = Boolean(token && token !== 'undefined');
  const [myRoadmaps, setMyRoadmaps] = useState<any>([]);
  const [myTravelLogs, setMyTravelLogs] = useState<any>([]);
  const [myLikedRoadmaps, setMyLikedRoadmaps] = useState<any>([]);
  const [myLikedTravelLogs, setMyLikedTravelLogs] = useState<any>([]);
  const [myLikedRegions, setMyLikedRegions] = useState<any>([]);
  const [isRoadmapsLoading, setIsRoadmapsLoading] = useState(true);
  const [isTravelLogsLoading, setIsTravelLogsLoading] = useState(true);
  const [isLikedRoadmapsLoading, setIsLikedRoadmapsLoading] = useState(true);
  const [isLikedTravelLogsLoading, setIsLikedTravelLogsLoading] = useState(true);
  const [isLikedRegionsLoading, setIsLikedRegionsLoading] = useState(true);

  useEffect(() => {
    const fetchList = async (
      fetcher: any,
      setter: any,
      setLoading: (value: boolean) => void,
    ) => {
      setLoading(true);

      try {
        const response = await fetcher(1, 10);
        const data =
          response.data?.courses ||
          response.courses ||
          response.data?.items ||
          response.items ||
          [];
        setter(data);
      } catch (error) {
        console.error('Error fetching mypage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchList(getMyRoadmaps, setMyRoadmaps, setIsRoadmapsLoading);
    fetchList(getMyTravelLogs, setMyTravelLogs, setIsTravelLogsLoading);
    fetchList(
      getMyLikedRoadmaps,
      setMyLikedRoadmaps,
      setIsLikedRoadmapsLoading,
    );
    fetchList(
      getMyLikedTravelLogs,
      setMyLikedTravelLogs,
      setIsLikedTravelLogsLoading,
    );
    fetchList(getMyLikedRegions, setMyLikedRegions, setIsLikedRegionsLoading);
  }, []);

  const userData = useMemo(
    () =>
      initialUser
        ? {
            name: initialUser.profile?.name || (initialUser as any).name,
            email: initialUser.profile?.email || (initialUser as any).email,
            totalTrips:
              initialUser.stats?.createdRoadmaps ??
              (initialUser as any).totalTrips ??
              0,
            totalCountries:
              initialUser.stats?.visitedCountries ??
              (initialUser as any).totalCountries ??
              0,
            diaryCount:
              initialUser.stats?.writtenBlogs ??
              (initialUser as any).diaryCount ??
              0,
            likedCount:
              initialUser.stats?.likedRegions ??
              (initialUser as any).bookmarkCount ??
              0,
          }
        : null,
    [initialUser],
  );

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
        id:
          item.id ||
          item.courseId ||
          data.id ||
          data.courseId ||
          data.course_id ||
          item.course_id,
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

  const sampleFeeds: FeedItem[] = [];

  const handleAction = (type: string) => {
    if (type === 'logout') {
      clearTokens();
      navigate('/login');
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-white">
        <Header isLoggedIn={isLoggedIn} />
        <div className="px-8 py-16 text-sm text-gray-400">
          마이페이지 정보를 불러오는 중입니다...
        </div>
      </div>
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
        isItineraryLoading={isRoadmapsLoading}
        isTravelLogsLoading={isTravelLogsLoading}
        isLikedRoadmapsLoading={isLikedRoadmapsLoading}
        isLikedTravelLogsLoading={isLikedTravelLogsLoading}
        isLikedRegionsLoading={isLikedRegionsLoading}
      />
    </div>
  );
}

export default MyPage;
