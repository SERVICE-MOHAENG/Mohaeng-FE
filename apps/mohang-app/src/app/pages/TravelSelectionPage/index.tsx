import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Header,
  useSurvey,
  getAccessToken,
  colors,
  typography,
} from '@mohang/ui';
import { TravelHeroSlider } from './TravelHeroSlider';
import { TravelInfo } from './TravelInfo';
import { TravelSearchBar } from './TravelSearchBar';
import { RecentSearchList } from './RecentSearchList';
import { TravelIndicator } from './TravelIndicator';
import { travelData } from './travelData';

export function TravelSelectionPage() {
  const { surveyData, updateSurveyData } = useSurvey();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const current = travelData[currentIndex];
  const selectedRegionNames = (surveyData.regions || []).map((r) => r.region);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token && token !== 'undefined');
  }, []);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? travelData.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === travelData.length - 1 ? 0 : prev + 1));

  const toggleRegion = (name: string) => {
    const formattedName = name;
    const isSelected = selectedRegionNames.includes(formattedName);

    let newRegions;
    if (isSelected) {
      newRegions = surveyData.regions.filter((r) => r.region !== formattedName);
    } else {
      newRegions = [
        ...surveyData.regions,
        { region: formattedName, start_date: '', end_date: '' },
      ];
    }
    updateSurveyData({ regions: newRegions });
  };

  const handleSearch = () => {
    const trimmed = searchValue.trim();
    if (!trimmed || trimmed.length >= 8) return;

    if (!recentSearches.includes(trimmed)) {
      setRecentSearches((prev) => [...prev, trimmed]);
    }

    if (!selectedRegionNames.includes(trimmed)) {
      updateSurveyData({
        regions: [
          ...surveyData.regions,
          { region: trimmed, start_date: '', end_date: '' },
        ],
      });
    }

    setSearchValue('');
  };

  const handleNextStep = () => {
    if (surveyData.regions.length === 0) {
      alert('최소 하나 이상의 여행지를 선택해주세요.');
      return;
    }
    navigate('/calendar');
  };

  const isNextDisabled = surveyData.regions.length === 0;

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
          isSelected={selectedRegionNames.includes(current.country)}
          onToggleSelect={() => toggleRegion(current.country)}
        />

        <TravelIndicator
          currentIndex={currentIndex}
          total={travelData.length}
          onSelect={setCurrentIndex}
          isItemSelected={(idx) =>
            selectedRegionNames.includes(travelData[idx].country)
          }
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

        <div className="absolute bottom-10 right-12">
          <button
            onClick={handleNextStep}
            disabled={isNextDisabled}
            className={`px-6 py-2 rounded-lg text-white font-bold text-lg transition-all active:scale-95 shadow-md ${
              isNextDisabled
                ? 'opacity-50 cursor-not-allowed grayscale'
                : 'hover:-translate-y-1'
            }`}
            style={{
              backgroundColor: colors.primary[500],
              ...typography.body.BodyM,
            }}
          >
            다음
          </button>
        </div>
      </main>
    </div>
  );
}

export default TravelSelectionPage;
