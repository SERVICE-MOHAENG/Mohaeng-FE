import { useState } from 'react';
import RedHeart from '../assets/redHeart.svg';
import Heart from '../assets/heart.svg';
import { useLikeCounts } from '../hooks/useLikeCounts';

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
  user: any;
  onAction: (type: string) => void;
  destinations: Destination[];
  feeds?: FeedItem[];
}

export function MyPage({ user, onAction, destinations, feeds }: MyPageProps) {
  const [activeTab, setActiveTab] = useState('itinerary');
  const { likeCounts, hearts, handleHeartClick } = useLikeCounts({ feeds });

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
          <h2 className="text-lg font-bold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-400 font-medium">{user.email}</p>
        </div>
      </div>

      {/* 2. 통계 카드 (원본 이미지의 연한 회색 배경 적용) */}
      <div className="w-full bg-[#F8F9FB] rounded-2xl py-8 flex justify-between mb-12 shadow-sm">
        <StatItem
          label="총 여행 횟수"
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
          value={user.bookmarkCount}
          color="text-gray-800"
        />
      </div>

      {/* 3. 내 일정 섹션 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6">내 일정</h2>

        {/* 탭 메뉴 */}
        <div className="flex border-b border-gray-100 mb-6">
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

        {/* 일정 리스트 */}
        <div className="space-y-4 bg-[#F8F9FB] p-6 rounded-2xl">
          {/* 일정 리스트 부분 수정 */}
          <div className="space-y-4 bg-[#F8F9FB] p-6 rounded-2xl">
            {destinations.map((dest) => {
              const targetFeed = feeds?.find((feed) => feed.id === dest.id);

              // 좋아요 상태와 카운트 가져오기
              const isLiked = hearts[dest.id];
              const currentLikeCount =
                likeCounts[dest.id] ?? targetFeed?.likes ?? 0;

              return (
                <div
                  key={dest.id}
                  className="bg-white rounded-xl p-4 flex items-center relative shadow-sm border border-gray-50"
                >
                  <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 mr-5">
                    <img
                      src={dest.imageUrl}
                      alt={dest.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

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

                  {/* 좋아요 영역 */}
                  {targetFeed && (
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
                  )}

                  <button className="bg-[#00BFFF] text-white text-[10px] px-4 py-2 rounded-lg font-bold">
                    바로가기
                  </button>
                </div>
              );
            })}
          </div>

          {/* 페이지네이션 도트 */}
          <div className="flex justify-center gap-1.5 mt-4">
            <div className="w-4 h-1 bg-[#00BFFF] rounded-full" />
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
          </div>
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
          <SettingItem label="로그아웃" onClick={() => onAction('logout')} />
          <SettingItem label="회원탈퇴" onClick={() => onAction('withdraw')} />
        </div>
      </section>
    </div>
  );
}

// ... (StatItem, TabItem, SettingItem 보조 컴포넌트는 기존과 동일)

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
    className={`flex-1 pb-3 text-sm font-bold transition-all ${active ? 'text-gray-800 border-b-2 border-[#00BFFF]' : 'text-gray-400'}`}
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
