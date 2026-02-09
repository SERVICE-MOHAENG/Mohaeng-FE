import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@mohang/ui';
import { colors } from '@mohang/ui';
import { TravelHeroSlider } from './TravelHeroSlider';
import { TravelInfo } from './TravelInfo';
import { TravelSearchBar } from './TravelSearchBar';
import { RecentSearchList } from './RecentSearchList';
import { TravelIndicator } from './TravelIndicator';
import { travelData } from './travelData';

export function TravelSelectionPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const current = travelData[currentIndex];

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token && token !== 'undefined');
  }, []);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? travelData.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === travelData.length - 1 ? 0 : prev + 1));

  const handleSearch = () => {
    const trimmed = searchValue.trim();
    if (!trimmed || trimmed.length >= 8) return;
    setRecentSearches((prev) => [...prev, trimmed]);
    setSearchValue('');
  };

  const handleNextClick = () => {};

  return (
    <div
      className="bg-white flex flex-col overflow-hidden relative font-sans"
      style={{ minHeight: 'calc(100vh / 0.85)', zoom: '0.85' }}
    >
      <Header isLoggedIn={isLoggedIn} />

      <main className="h-full flex-1 flex flex-col items-center justify-start relative overflow-hidden">
        <TravelHeroSlider
          currentIndex={currentIndex}
          onPrev={handlePrev}
          onNext={handleNext}
          travelData={travelData}
        />

        <TravelIndicator
          currentIndex={currentIndex}
          total={travelData.length}
          onSelect={setCurrentIndex}
        />

        <div className="flex flex-col items-center w-full max-w-xl z-30">
          <TravelInfo {...current} currentIndex={currentIndex} />

          <TravelSearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
            placeholder={`${current.country}에서 방문하고 싶은 도시를 입력해주세요.`}
          />
        </div>

        <RecentSearchList
          searches={recentSearches}
          onRemove={(i) =>
            setRecentSearches((prev) => prev.filter((_, idx) => idx !== i))
          }
        />

        {/* 다음 버튼 */}
        <div className="absolute bottom-12 right-12">
          <Link to="/calendar">
            <button
              className="px-6 py-2 rounded-lg text-white font-bold text-lg transition-all hover:-translate-y-1 active:scale-95"
              style={{ backgroundColor: colors.primary[500] }}
              onClick={handleNextClick}
              aria-label="다음 여행지 선택"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNextClick();
                }
              }}
              type="button"
            >
              다음
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default TravelSelectionPage;
