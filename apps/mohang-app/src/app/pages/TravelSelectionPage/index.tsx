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
import { getCountries } from '@mohang/ui';

export function TravelSelectionPage() {
  const { surveyData, updateSurveyData } = useSurvey();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchCountry, setSearchCountry] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const current = travelData[currentIndex];
  const selectedRegionNames = (surveyData.regions || []).map((r) => r.region);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token && token !== 'undefined');
  }, []);

  const [fetchedRegions, setFetchedRegions] = useState<
    { id: string; name: string; imageUrl: string }[]
  >([]);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? travelData.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === travelData.length - 1 ? 0 : prev + 1));

  const handleSearchCountry = async () => {
    const trimmed = searchCountry.trim();
    if (!trimmed) return;

    try {
      const res = await getCountries(trimmed);
      console.log('Fetched countries result (raw):', res);

      const data = (res as any).data || res;
      const regions = data.regions || (Array.isArray(data) ? data : null);

      console.log('Processed regions:', regions);

      if (regions && Array.isArray(regions)) {
        setFetchedRegions(regions);
      } else {
        console.warn('Regions not found or not an array:', regions);
      }
    } catch (error) {
      console.error('Failed to fetch regions:', error);
      alert('국가 정보를 가져오는 데 실패했습니다.');
    }
  };

  const handleSearchCity = () => {
    const trimmed = searchCity.trim();
    if (!trimmed) return;

    if (!selectedRegionNames.includes(trimmed)) {
      updateSurveyData({
        regions: [
          ...surveyData.regions,
          { region: trimmed, start_date: '', end_date: '' },
        ],
      });
    }

    setSearchCity('');
  };

  const handleRemoveRegion = (regionName: string) => {
    updateSurveyData({
      regions: surveyData.regions.filter((r) => r.region !== regionName),
    });
  };

  const handleNextStep = () => {
    if (surveyData.regions.length === 0) {
      alert('최소 하나 이상의 여행지를 선택해주세요.');
      return;
    }
    navigate('/calendar');
  };

  const isNextDisabled = surveyData.regions.length === 0;

  const filteredRegions = fetchedRegions.filter((region) =>
    region.name.toLowerCase().includes(searchCity.toLowerCase()),
  );

  return (
    <div
      className="bg-white flex flex-col overflow-hidden relative font-sans"
      style={{ minHeight: 'calc(100vh / 0.85)', zoom: '0.85' }}
    >
      <Header isLoggedIn={isLoggedIn} />

      <main className="h-full flex-1 flex flex-col items-center justify-start relative overflow-hidden">
        <div className="flex flex-col items-center w-full max-w-xl z-30 mt-3">
          <TravelSearchBar
            value={searchCountry}
            onChange={setSearchCountry}
            onSearch={handleSearchCountry}
            placeholder={`방문하고 싶은 나라를 입력해주세요.`}
          />
        </div>

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
          isItemSelected={(idx) =>
            selectedRegionNames.includes(travelData[idx].country)
          }
        />

        <div className="flex flex-col items-center w-full max-w-xl z-30">
          <TravelInfo {...current} currentIndex={currentIndex} />
          <div className="w-full relative">
            <TravelSearchBar
              value={searchCity}
              onChange={setSearchCity}
              onSearch={handleSearchCity}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={`${current.country}에서 방문하고 싶은 도시를 입력해주세요.`}
            />

            {showSuggestions && filteredRegions.length > 0 && (
              <div
                className="absolute bottom-full left-10 right-10 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden mb-2 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
                style={{
                  maxHeight: '250px',
                  overflowY: 'auto',
                  scrollbarWidth: 'thin',
                  scrollbarColor: `${colors.gray[200]} transparent`,
                }}
              >
                {filteredRegions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => {
                      if (!selectedRegionNames.includes(region.name)) {
                        updateSurveyData({
                          regions: [
                            ...surveyData.regions,
                            {
                              region: region.name,
                              start_date: '',
                              end_date: '',
                            },
                          ],
                        });
                      }
                      setShowSuggestions(false);
                      setSearchCity('');
                    }}
                    className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-none"
                  >
                    <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-500">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span
                        style={{
                          ...typography.body.BodyB,
                          color: colors.gray[800],
                        }}
                      >
                        {region.name}
                      </span>
                      <span
                        style={{
                          ...typography.label.labelM,
                          color: colors.gray[400],
                        }}
                      >
                        {current.country}의 행정 구역
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <RecentSearchList
          searches={selectedRegionNames}
          onRemove={(i) => handleRemoveRegion(selectedRegionNames[i])}
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
