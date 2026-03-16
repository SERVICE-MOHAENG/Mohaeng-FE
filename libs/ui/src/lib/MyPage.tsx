import { useState, useRef } from 'react';
import RedHeart from '../assets/redHeart.svg';
import Heart from '../assets/heart.svg';
import { useLikeCounts } from '../hooks/useLikeCounts';
import { withdraw } from '../api/auth';
import { clearTokens } from '../api/authUtils';
import { useNavigate } from 'react-router-dom';

export interface Destination {
  id: string;
  title: string;
  duration: string;
  description: string;
  tags: string[];
  imageUrl: string;
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
  feeds?: FeedItem[];
}

export function MyPage({
  userName,
  user,
  onAction,
  destinations,
  travelLogs,
  likedRoadmaps,
  feeds,
}: MyPageProps) {
  const [activeTab, setActiveTab] = useState('itinerary');
  const { likeCounts, hearts, handleHeartClick } = useLikeCounts({ feeds });
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const newSlide = Math.round(scrollLeft / clientWidth);
      if (newSlide !== currentSlide) {
        setCurrentSlide(newSlide);
      }
    }
  };

  const scrollToSection = (index: number) => {
    if (scrollRef.current) {
      const clientWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: index * clientWidth,
        behavior: 'smooth',
      });
    }
  };

  const normalizedGroups: Destination[][] =
    activeTab === 'itineraryLike'
      ? likedRoadmaps.length > 0 && Array.isArray(likedRoadmaps[0])
        ? (likedRoadmaps as any)
        : [likedRoadmaps as any]
      : destinations.length > 0 && Array.isArray(destinations[0])
        ? (destinations as any)
        : [destinations as any];

  const normalizedTravelLogs: Destination[][] =
    travelLogs.length > 0 && Array.isArray(travelLogs[0])
      ? (travelLogs as any)
      : [travelLogs as any];

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
        {activeTab === 'history' ? (
          normalizedTravelLogs.length === 0 ||
          (normalizedTravelLogs.length === 1 &&
            normalizedTravelLogs[0].length === 0) ? (
            <EmptyState message="여행 기록 데이터가 없습니다." />
          ) : (
            <div className="relative">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4"
              >
                {normalizedTravelLogs.map((group, groupIdx) => (
                  <div
                    key={groupIdx}
                    className="flex-none w-full snap-center space-y-4 p-1"
                  >
                    <div className="bg-white rounded-2xl p-4 sm:p-5 space-y-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50">
                      {group.map((log: any) => (
                        <div
                          key={log.id}
                          className="bg-[#FAFAFA] rounded-xl p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-5">
                            {log.imageUrl ? (
                              <img
                                src={log.imageUrl}
                                alt={log.title}
                                className="w-[68px] h-[68px] rounded-md flex-shrink-0 object-cover"
                              />
                            ) : (
                              <div className="w-[68px] h-[68px] bg-[#9A6A6A] rounded-md flex-shrink-0" />
                            )}
                            <span className="font-bold text-gray-800 text-[15px]">
                              {log.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-6 sm:gap-8">
                            <div className="flex flex-col items-center justify-center">
                              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm mb-1 border border-gray-50">
                                <img
                                  src={log.isLiked ? RedHeart : Heart}
                                  alt="heart"
                                  className="w-4 h-4"
                                />
                              </div>
                              <span className="text-[10px] text-gray-400 font-bold mt-[2px]">
                                {log.likeCount?.toLocaleString() || 0}
                              </span>
                            </div>
                            <button className="bg-[#00BFFF] text-white text-[12px] px-5 py-2 rounded-full font-bold hover:bg-[#0096cc] transition-colors">
                              바로가기
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 인디케이터 도트 */}
              {normalizedTravelLogs.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-4">
                  {normalizedTravelLogs.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToSection(i)}
                      className={`w-${currentSlide === i ? '4' : '1'} h-1 ${
                        currentSlide === i ? 'bg-[#00BFFF]' : 'bg-gray-300'
                      } rounded-full transition-all duration-300`}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        ) : normalizedGroups.length === 0 ||
          (normalizedGroups.length === 1 &&
            normalizedGroups[0].length === 0) ? (
          <EmptyState message="좋아요한 여행 일정이 없습니다." />
        ) : (
          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4"
            >
              {normalizedGroups.map((group, groupIdx) => (
                <div
                  key={groupIdx}
                  className="flex-none w-full snap-center space-y-4 p-1"
                >
                  <div className="space-y-4 rounded-xl p-5">
                    {group.map((dest) => {
                      const targetFeed = feeds?.find(
                        (feed) => feed.id === dest.id,
                      );

                      const isLiked = hearts[dest.id];
                      const currentLikeCount =
                        likeCounts[dest.id] ?? targetFeed?.likes ?? 0;

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
                              {dest.tags.map((tag) => (
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
                                  onClick={() => handleHeartClick(dest.id)}
                                >
                                  <div className="w-10 h-10 flex justify-center items-center rounded-full border border-gray-100">
                                    <img
                                      src={isLiked ? RedHeart : Heart}
                                      alt="heart"
                                      className="w-1/2"
                                    />
                                  </div>
                                </button>
                                <span className="text-[10px] font-bold text-gray-400 mt-[-2px]">
                                  {currentLikeCount.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <button className="bg-[#00BFFF] text-white text-[10px] px-4 py-2 rounded-lg font-bold hover:bg-[#0096cc] transition-colors">
                              바로가기
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* 인디케이터 도트 */}
            {normalizedGroups.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-4">
                {normalizedGroups.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToSection(i)}
                    className={`w-${currentSlide === i ? '4' : '1'} h-1 ${
                      currentSlide === i ? 'bg-[#00BFFF]' : 'bg-gray-300'
                    } rounded-full transition-all duration-300`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 설정 섹션 */}
      <section>
        <h2 className="text-xl font-bold mb-4">설정</h2>
        <div className="space-y-2">
          <SettingItem
            label="비밀번호 변경"
            onClick={() => onAction('password')}
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
    </div>
  );
}

// 하위 보조 컴포넌트들
const StatItem = ({ label, value, color }: any) => (
  <div className="text-center flex-1">
    <div className={`text-2xl font-black mb-1 ${color}`}>{value}</div>
    <div className="text-[11px] text-gray-500">{label}</div>
  </div>
);

const TabItem = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2.5 text-sm font-bold transition-all ${
      active ? 'text-gray-800 border-b-2 border-[#00BFFF]' : 'text-gray-400'
    }`}
  >
    {label}
  </button>
);

const SettingItem = ({ label, onClick }: any) => (
  <button
    onClick={onClick}
    className="w-full text-left p-4 bg-[#F8F9FB] hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 transition-colors"
  >
    {label}
  </button>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-50">
    <svg
      className="w-16 h-16 text-gray-300 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
    <p className="text-gray-500 font-medium">{message}</p>
  </div>
);
