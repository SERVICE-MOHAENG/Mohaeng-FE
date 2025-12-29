import { useState } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  profileImage?: string;
  memberSince: string;
  totalTrips: number;
  totalCountries: number;
  upcomingTrips?: number;
  favoritePlaces?: number;
}

export interface MyPageProps {
  user: UserProfile;
  onLogout?: () => void;
  onEditProfile?: () => void;
  onDeleteAccount?: () => void;
}

export function MyPage({ user, onLogout, onEditProfile, onDeleteAccount }: MyPageProps) {
  const [activeMenu, setActiveMenu] = useState<'home' | 'personal' | 'points' | 'history' | 'favorites'>('home');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* 왼쪽 사이드바 */}
          <div className="w-80 flex-shrink-0">
            {/* 프로필 카드 */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">마이페이지</h2>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-white">{user.name[0]}</span>
                  )}
                </div>
                <div>
                  <div className="text-base font-bold text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
              </div>
            </div>

            {/* 메뉴 */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-4">
              <button
                onClick={() => setActiveMenu('home')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  activeMenu === 'home' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-semibold">홈</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <button
                onClick={() => setActiveMenu('personal')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  activeMenu === 'personal' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-semibold">개인정보 관리</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <button
                onClick={() => setActiveMenu('history')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  activeMenu === 'history' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-semibold">여행 일정</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <button
                onClick={() => setActiveMenu('favorites')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  activeMenu === 'favorites' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-semibold">찜한 여행지</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <div className="border-t border-gray-100 my-2"></div>

              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-semibold">로그아웃</span>
              </button>
            </div>
          </div>

          {/* 오른쪽 컨텐츠 영역 */}
          <div className="flex-1">
            {activeMenu === 'home' && (
              <div>
                <div className="bg-white rounded-2xl p-8 mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">반가워요 {user.name}님</h1>
                  <p className="text-gray-600">오늘도 좋은 하루 보내세요</p>
                </div>

                {/* 통계 카드 */}
                <div className="bg-white rounded-2xl p-8 mb-6">
                  <div className="flex items-center justify-around">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">{user.totalTrips}</div>
                      <div className="text-sm text-gray-600">총 여행 횟수</div>
                    </div>
                    <div className="w-px h-16 bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">{user.totalCountries}</div>
                      <div className="text-sm text-gray-600">방문한 국가</div>
                    </div>
                    <div className="w-px h-16 bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">{user.upcomingTrips || 0}</div>
                      <div className="text-sm text-gray-600">예정된 일정</div>
                    </div>
                    <div className="w-px h-16 bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">{user.favoritePlaces || 0}</div>
                      <div className="text-sm text-gray-600">찜한 여행지</div>
                    </div>
                  </div>
                </div>

                {/* 여행 관련 섹션 */}
                <div className="bg-white rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">내 여행</h2>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-3 -mx-3 transition-colors">
                      <span className="text-base text-gray-900">내 여행 일정</span>
                      <span className="text-gray-400">→</span>
                    </button>
                    <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-3 -mx-3 transition-colors">
                      <span className="text-base text-gray-900">여행 기록</span>
                      <span className="text-gray-400">→</span>
                    </button>
                    <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-3 -mx-3 transition-colors">
                      <span className="text-base text-gray-900">즐겨찾기</span>
                      <span className="text-gray-400">→</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === 'personal' && (
              <div className="space-y-4">
                {/* 프로필 정보 카드 */}
                <div className="bg-white rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-3xl font-bold text-white">{user.name[0]}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-xl font-bold text-gray-900 mb-1">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-sm text-gray-500 mt-1">회원 가입일: {user.memberSince}</div>
                    </div>
                    <button
                      onClick={onEditProfile}
                      className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    >
                      프로필 수정
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">개인정보</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-base text-gray-600">이름</span>
                      <span className="text-base font-semibold text-gray-900">{user.name}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-base text-gray-600">이메일</span>
                      <span className="text-base font-semibold text-gray-900">{user.email}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-base text-gray-600">비밀번호</span>
                      <button className="text-base font-semibold text-blue-600 hover:text-blue-700">
                        변경하기 →
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">알림 설정</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <div className="text-base font-semibold text-gray-900 mb-1">여행 일정 알림</div>
                        <div className="text-sm text-gray-600">여행 출발 전 알림을 받습니다</div>
                      </div>
                      <button className="w-12 h-7 bg-blue-600 rounded-full relative transition-colors">
                        <span className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-3 border-t border-gray-100">
                      <div>
                        <div className="text-base font-semibold text-gray-900 mb-1">마케팅 정보 수신</div>
                        <div className="text-sm text-gray-600">이벤트 및 혜택 정보를 받습니다</div>
                      </div>
                      <button className="w-12 h-7 bg-gray-300 rounded-full relative transition-colors">
                        <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full"></span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onDeleteAccount}
                  className="w-full text-red-600 py-4 text-sm hover:bg-red-50 rounded-2xl transition-colors"
                >
                  회원탈퇴
                </button>
              </div>
            )}

            {activeMenu === 'history' && (
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">내 여행 일정</h2>
                <div className="text-center py-12 text-gray-500">
                  아직 생성한 여행 일정이 없습니다
                </div>
              </div>
            )}

            {activeMenu === 'favorites' && (
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">찜한 여행지</h2>
                <div className="text-center py-12 text-gray-500">
                  찜한 여행지가 없습니다
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
