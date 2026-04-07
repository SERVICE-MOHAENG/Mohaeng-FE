import { MyPage as MyPageComponent, Header, UserResponse, getMainPageUser } from '@mohang/ui';
import { useNavigate } from 'react-router-dom';
import { FeedItem, clearTokens, getAccessToken } from '@mohang/ui';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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

  const {
    data: fetchedUser,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery<UserResponse | null>({
    queryKey: ['mypage-user'],
    queryFn: getMainPageUser,
    enabled: isLoggedIn && !initialUser,
    retry: false,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      setIsRoadmapsLoading(false);
      setIsTravelLogsLoading(false);
      setIsLikedRoadmapsLoading(false);
      setIsLikedTravelLogsLoading(false);
      setIsLikedRegionsLoading(false);
      return;
    }

    const fetchList = async (
      fetcher: any,
      setter: any,
      setLoading: (value: boolean) => void,
    ) => {
      setLoading(true);

      try {
        const response = await fetcher(1, 10);
        const data =
          response.data?.blogs ||
          response.blogs ||
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
  }, [isLoggedIn]);

  const resolvedUser = fetchedUser || initialUser;

  const userData = useMemo(
    () =>
      resolvedUser
        ? {
            name: resolvedUser.profile?.name || (resolvedUser as any).name,
            email: resolvedUser.profile?.email || (resolvedUser as any).email,
            totalTrips:
              resolvedUser.stats?.createdRoadmaps ??
              (resolvedUser as any).totalTrips ??
              0,
            totalCountries:
              resolvedUser.stats?.visitedCountries ??
              (resolvedUser as any).totalCountries ??
              0,
            diaryCount:
              resolvedUser.stats?.writtenBlogs ??
              (resolvedUser as any).diaryCount ??
              0,
            likedCount:
              resolvedUser.stats?.likedRegions ??
              (resolvedUser as any).bookmarkCount ??
              0,
          }
        : null,
    [resolvedUser],
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
        likeCount:
          data.likeCount ?? data.like_count ?? item.likeCount ?? item.like_count ?? 0,
        isLiked:
          data.isLiked ?? data.is_liked ?? item.isLiked ?? item.is_liked ?? false,
      };
    });

  const mapTravelLogs = (items: any[]) =>
    (items || []).map((item: any) => {
      const data = item.data || item;
      return {
        id: data.id || item.id,
        title: data.title || '',
        duration:
          data.dateText ||
          data.createdAt?.split('T')?.[0] ||
          data.created_at?.split('T')?.[0] ||
          '',
        tags: data.tags || [],
        description: data.content || '',
        imageUrl:
          data.imageUrl ||
          data.image_url ||
          data.imageUrls?.[0] ||
          data.image_urls?.[0] ||
          '',
        likeCount: data.likeCount ?? data.like_count ?? 0,
        isLiked: data.isLiked ?? data.is_liked ?? false,
        createdAt: data.createdAt || data.created_at || '',
      };
    });

  const userDestinations = chunkArray(mapDestinations(myRoadmaps as any[]), 3);
  const userTravelLogs = chunkArray(mapTravelLogs(myTravelLogs as any[]), 3);
  const userLikedRoadmaps = chunkArray(
    mapDestinations(myLikedRoadmaps as any[]),
    3,
  );
  const userLikedTravelLogs = chunkArray(
    mapTravelLogs(myLikedTravelLogs as any[]),
    3,
  );
  const userLikedRegions = chunkArray(
    mapDestinations(myLikedRegions as any[]),
    3,
  );

  const sampleFeeds: FeedItem[] = [];

  const handleAction = (type: string) => {
    if (type === 'logout') {
      clearTokens();
      navigate('/login');
    }
  };

  if (!userData && isUserLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header isLoggedIn={isLoggedIn} />
        <div className="px-8 py-16 text-sm text-gray-400">
          {'\uB9C8\uC774\uD398\uC774\uC9C0 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4...'}
        </div>
      </div>
    );
  }

  if (!userData && isUserError) {
    return (
      <div className="min-h-screen bg-white">
        <Header isLoggedIn={isLoggedIn} />
        <div className="px-8 py-16 text-sm text-gray-400">
          마이페이지 정보를 불러오지 못했습니다.
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header isLoggedIn={isLoggedIn} />
      <MyPageComponent
        userName={userData.name}
        feeds={sampleFeeds}
        destinations={userDestinations}
        travelLogs={userTravelLogs}
        likedRoadmaps={userLikedRoadmaps}
        likedTravelLogs={userLikedTravelLogs}
        likedRegions={userLikedRegions}
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

