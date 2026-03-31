import { useState } from 'react';
import RedHeart from '../assets/redHeart.svg';
import Heart from '../assets/heart.svg';
import { useLikeCounts } from '../hooks/useLikeCounts';
import { addLike, removeLike } from '../api/courses';
import { addBlogLike, removeBlogLike } from '../api/blogs';
import { withdraw, updateMe } from '../api/auth';
import { clearTokens } from '../api/authUtils';
import { useNavigate } from 'react-router-dom';
import { StatItem } from './components/MyPage/StatItem';
import { TabItem } from './components/MyPage/TabItem';
import { SettingItem } from './components/MyPage/SettingItem';
import { EmptyState } from './components/MyPage/EmptyState';
import { CarouselList } from './components/MyPage/CarouselList';
import { PasswordChangeModal } from './components/MyPage/PasswordChangeModal';

export interface Destination {
  id: string;
  title: string;
  duration: string;
  description: string;
  tags: string[];
  imageUrl: string;
  likeCount?: number;
  isLiked?: boolean;
}

export interface FeedItem {
  id: string;
  author: string;
  date: string;
  title: string;
  content: string;
  imageUrl: string;
  avatarUrl?: string;
  likes: number;
}

interface MyPageProps {
  userName: string;
  user: any;
  onAction: (type: string) => void;
  destinations: Destination[] | Destination[][];
  travelLogs: Destination[] | Destination[][];
  likedRoadmaps: Destination[] | Destination[][];
  likedTravelLogs: Destination[] | Destination[][];
  likedRegions: Destination[] | Destination[][];
  feeds?: FeedItem[];
  isItineraryLoading?: boolean;
  isTravelLogsLoading?: boolean;
  isLikedRoadmapsLoading?: boolean;
  isLikedTravelLogsLoading?: boolean;
  isLikedRegionsLoading?: boolean;
}

export function MyPage({
  userName,
  user,
  onAction,
  destinations,
  travelLogs,
  likedRoadmaps,
  likedTravelLogs,
  likedRegions,
  feeds,
  isItineraryLoading = false,
  isTravelLogsLoading = false,
  isLikedRoadmapsLoading = false,
  isLikedTravelLogsLoading = false,
  isLikedRegionsLoading = false,
}: MyPageProps) {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = async (password: string, passwordConfirm: string) => {
    await updateMe({ password, passwordConfirm });
  };

  const getNormalizedData = (data: any) =>
    data.length > 0 && Array.isArray(data[0]) ? data : [data as any];

  const normalizedGroups =
    activeTab === 'itineraryLike' ? getNormalizedData(likedRoadmaps) : getNormalizedData(destinations);

  const normalizedTravelLogs =
    activeTab === 'blogLike' ? getNormalizedData(likedTravelLogs) : getNormalizedData(travelLogs);

  const normalizedLikedRegions = getNormalizedData(likedRegions);
  const flattenedTravelLogs = normalizedTravelLogs.flat();
  const blogFeeds = flattenedTravelLogs.map((log: any) => ({
    id: log.id,
    author: '',
    date: log.createdAt || '',
    title: log.title || '',
    content: log.description || '',
    imageUrl: log.imageUrl || '',
    likes: Number(log.likeCount ?? 0),
    isLiked: Boolean(log.isLiked),
  }));
  const { likeCounts, hearts, handleHeartClick } = useLikeCounts({ feeds: blogFeeds });

  const renderSectionLoading = (message: string) => (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-[#FAFAFA] px-6 py-12 text-center">
      <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-[#00BFFF]/20 border-t-[#00BFFF]" />
      <p className="text-sm font-medium text-gray-500">{message}</p>
    </div>
  );

  const renderTravelLogItem = (log: any) => (
    <div
      key={log.id}
      className="bg-white rounded-xl p-4 flex items-center justify-between relative shadow-sm border border-gray-50 hover:border-[#00BFFF] transition-colors"
    >
      <div className="flex-2">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-gray-800 text-sm">
            {log.title}
          </h3>
        </div>
        <p className="text-xs text-gray-400 mb-2">
          {log.duration}
        </p>
        <div className="flex gap-1 flex-wrap">
          {log.tags?.map((tag: string) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 bg-blue-50 text-[#00BFFF] rounded-full font-bold"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 items-center justify-center">
          <div className="w-1/5 flex flex-col items-center">
            <button
              className="p-1 rounded-full hover:bg-gray-50 transition-colors"
              onClick={() =>
                handleHeartClick(log.id, {
                  onLike: (id) => addBlogLike(id),
                  onUnlike: (id) => removeBlogLike(id),
                })
              }
            >
              <div className="w-10 h-10 flex justify-center items-center rounded-full border border-gray-100">
                <img
                  src={(hearts[log.id] ?? log.isLiked) ? RedHeart : Heart}
                  alt="heart"
                  className="w-1/2"
                />
              </div>
            </button>
            <span className="text-[10px] font-bold text-gray-400 mt-1">
              {(likeCounts[log.id] ?? log.likeCount ?? 0).toLocaleString()}
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate(`/plan-detail/${log.id}`, { state: { isCourseView: true, isMyPlan: true, authorName: userName } })}
          className="bg-[#00BFFF] text-white text-[10px] px-4 py-2 rounded-lg font-bold hover:bg-[#0096cc] transition-colors"
        >
          바로가기
        </button>
      </div>
    </div>
  );

  const renderItineraryItem = (dest: any) => {
    const initialIsLiked = Boolean(dest.isLiked ?? dest.is_liked);
    const initialLikeCount = Number(dest.likeCount ?? dest.like_count ?? 0);
    const isLiked = hearts[dest.id] ?? initialIsLiked;
    const currentLikeCount = likeCounts[dest.id] ?? initialLikeCount;

    return (
      <div
        key={dest.id}
        className="bg-white rounded-xl p-4 flex items-center justify-between relative shadow-sm border border-gray-50 hover:border-[#00BFFF] transition-colors"
      >
        <div className="flex-2">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-800 text-sm">
              {dest.title}
            </h3>
          </div>
          <p className="text-xs text-gray-400 mb-2">
            {dest.duration}
          </p>
          <div className="flex gap-1">
            {dest.tags?.map((tag: string) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 bg-blue-50 text-[#00BFFF] rounded-full font-bold"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 items-center justify-center">
            <div className="w-1/5 flex flex-col items-center">
              <button
                className="p-1 rounded-full hover:bg-gray-50 transition-colors"
                onClick={() => handleHeartClick(dest.id, {
                  onLike: (id) => addLike(id),
                  onUnlike: (id) => removeLike(id),
                })}
              >
                <div className="w-10 h-10 flex justify-center items-center rounded-full border border-gray-100">
                  <img
                    src={isLiked ? RedHeart : Heart}
                    alt="heart"
                    className="w-1/2"
                  />
                </div>
              </button>
              <span className="text-[10px] font-bold text-gray-400 mt-1">
                {currentLikeCount.toLocaleString()}
              </span>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/plan-detail/${dest.id}`, { state: { isCourseView: true, isMyPlan: true, authorName: userName } })}
            className="bg-[#00BFFF] text-white text-[10px] px-4 py-2 rounded-lg font-bold hover:bg-[#0096cc] transition-colors"
          >
            바로가기
          </button>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === 'itinerary' && isItineraryLoading) {
      return renderSectionLoading('내 여행 일정을 불러오는 중입니다...');
    }

    if (activeTab === 'history' && isTravelLogsLoading) {
      return renderSectionLoading('여행 기록을 불러오는 중입니다...');
    }

    if (activeTab === 'itineraryLike' && isLikedRoadmapsLoading) {
      return renderSectionLoading('좋아요한 여행 일정을 불러오는 중입니다...');
    }

    if (activeTab === 'blogLike' && isLikedTravelLogsLoading) {
      return renderSectionLoading('좋아요한 블로그를 불러오는 중입니다...');
    }

    if (activeTab === 'destinationLike' && isLikedRegionsLoading) {
      return renderSectionLoading('좋아요한 여행지를 불러오는 중입니다...');
    }

    if (activeTab === 'history' || activeTab === 'blogLike') {
      const isEmpty = normalizedTravelLogs.length === 0 || (normalizedTravelLogs.length === 1 && normalizedTravelLogs[0].length === 0);
      return isEmpty ? (
        <EmptyState message={activeTab === 'blogLike' ? '좋아요한 블로그가 없습니다.' : '여행 기록이 없습니다.'} />
      ) : (
        <CarouselList dataGroups={normalizedTravelLogs} renderItem={renderTravelLogItem} />
      );
    }
    
    if (activeTab === 'destinationLike') {
      const isEmpty = normalizedLikedRegions.length === 0 || (normalizedLikedRegions.length === 1 && normalizedLikedRegions[0].length === 0);
      return isEmpty ? (
        <EmptyState message={'좋아요한 여행지가 없습니다.'} />
      ) : (
        <CarouselList dataGroups={normalizedLikedRegions} renderItem={renderTravelLogItem} />
      );
    }
    
    // Default: itinerary & itineraryLike
    const isEmpty = normalizedGroups.length === 0 || (normalizedGroups.length === 1 && normalizedGroups[0].length === 0);
    return isEmpty ? (
      <EmptyState message={activeTab === 'itineraryLike' ? '좋아요한 여행 일정이 없습니다.' : '내 여행 일정이 없습니다.'} />
    ) : (
      <CarouselList dataGroups={normalizedGroups} renderItem={renderItineraryItem} listClassName="space-y-4 rounded-xl p-5" />
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      {/* 프로필 정보 카드 */}
      <div className="w-full rounded-2xl p-6 flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
          <div className="w-full h-full bg-[#E5E7EB] flex items-center justify-center text-gray-400">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-10 h-10">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">{userName}</h2>
          <p className="text-sm text-gray-400 font-medium">{user.email}</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="w-full bg-[#F8F9FB] rounded-2xl py-8 flex justify-between mb-12 shadow-sm">
        <StatItem
          label="생성한 로드맵 수"
          value={user.totalTrips}
          color="text-gray-800"
        />
        <div className="w-px h-10 bg-gray-200 self-center" />
        <StatItem
          label="방문한 국가"
          value={user.totalCountries}
          color="text-[#00BFFF]"
        />
        <div className="w-px h-10 bg-gray-100 self-center" />
        <StatItem
          label="작성한 여행 기록"
          value={user.diaryCount}
          color="text-gray-800"
        />
        <div className="w-px h-10 bg-gray-100 self-center" />
        <StatItem
          label="찜한 예정지"
          value={user.likedCount}
          color="text-gray-800"
        />
      </div>

      {/* 내 일정 섹션 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6">내 일정</h2>

        {/* 탭 메뉴 - 세그먼트 스타일로 변경하여 가득 채움 */}
        <div className="flex p-1 rounded-xl mb-6">
          <TabItem
            label="내 여행 일정"
            active={activeTab === 'itinerary'}
            onClick={() => setActiveTab('itinerary')}
          />
          <TabItem
            label="여행 기록"
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
          />
          <TabItem
            label="일정 좋아요"
            active={activeTab === 'itineraryLike'}
            onClick={() => setActiveTab('itineraryLike')}
          />
          <TabItem
            label="블로그 좋아요"
            active={activeTab === 'blogLike'}
            onClick={() => setActiveTab('blogLike')}
          />
          <TabItem
            label="좋아요한 여행지"
            active={activeTab === 'destinationLike'}
            onClick={() => setActiveTab('destinationLike')}
          />
        </div>
        {/* 리스트 영역 */}
        {renderTabContent()}
      </section>

      {/* 설정 섹션 */}
      <section>
        <h2 className="text-xl font-bold mb-4">설정</h2>
        <div className="space-y-2">
          <SettingItem
            label="비밀번호 변경"
            onClick={() => setIsPasswordModalOpen(true)}
          />
          <SettingItem
            label="로그아웃"
            onClick={() => {
              clearTokens();
              onAction('logout');
              navigate('/login');
            }}
          />
          <SettingItem
            label="회원탈퇴"
            onClick={async () => {
              console.log('회원탈퇴');
              try {
                await withdraw();
                clearTokens();
                alert('회원탈퇴 성공');
                onAction('withdraw');
                navigate('/login');
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </div>
      </section>

      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordChange}
      />
    </div>
  );
}
