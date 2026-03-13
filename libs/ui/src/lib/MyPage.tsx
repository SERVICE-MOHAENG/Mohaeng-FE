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
  feeds?: FeedItem[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function MyPage({
  userName,
  user,
  onAction,
  destinations,
  feeds,
  page = 1,
  totalPages = 1,
  onPageChange,
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
    destinations.length > 0 && Array.isArray(destinations[0])
      ? (destinations as any)
      : [destinations as any];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      {/* 1. 프로필 정보 카드 */}
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

      {/* 2. 통계 카드 (원본 이미지의 연한 회색 배경 적용) */}
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

      {/* 3. 내 일정 섹션 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6">내 일정</h2>

        {/* 탭 메뉴 - 세그먼트 스타일로 변경하여 가득 채움 */}
        <div className="flex p-1 bg-[#F8F9FB] rounded-xl mb-6">
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
            label="북마크"
            active={activeTab === 'bookmark'}
            onClick={() => setActiveTab('bookmark')}
          />
        </div>
        {/* 일정 리스트 - 가로 슬라이더 스타일 */}
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
                <div className="space-y-4 bg-[#F8F9FB] rounded-xl p-5 shadow-sm border border-gray-100">
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
      </section>

      {/* 4. 설정 섹션 */}
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
    className={`flex-1 py-2.5 text-sm font-bold transition-all rounded-lg ${
      active
        ? 'bg-white text-gray-800 shadow-sm'
        : 'text-gray-400 hover:text-gray-600'
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
