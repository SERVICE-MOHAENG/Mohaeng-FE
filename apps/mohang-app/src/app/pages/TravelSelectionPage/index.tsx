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
  const [activeSearchCountry, setActiveSearchCountry] = useState('');
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

  useEffect(() => {
    let isMounted = true;
    const fetchRegions = async () => {
      if (current && current.country) {
        try {
          const response: any = await getCountries(current.country);
          const regionsData =
            response.data?.regions ||
            response.regions ||
            response.data?.data?.regions;
          const regions = Array.isArray(regionsData) ? regionsData : [];
          if (isMounted) {
            setFetchedRegions(regions);
            setActiveSearchCountry(current.country);
          }
        } catch (e) {
          if (isMounted) setFetchedRegions([]);
        }
      }
    };
    fetchRegions();
    return () => {
      isMounted = false;
    };
  }, [current]);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? travelData.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === travelData.length - 1 ? 0 : prev + 1));

  const handleSearchCountry = async () => {
    const trimmed = searchCountry.trim();
    if (!trimmed) return;

    try {
      const response: any = await getCountries(trimmed);
      const regionsData =
        response.data?.regions ||
        response.regions ||
        response.data?.data?.regions;
      const regions = Array.isArray(regionsData) ? regionsData : [];
      setFetchedRegions(regions);
      setActiveSearchCountry(trimmed);
      console.log(regions, 'regions');
      console.log(activeSearchCountry, 'activeSearchCountry');
    } catch (error) {
      setFetchedRegions([]);
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
    searchCity.trim() === ''
      ? true
      : region.name.toLowerCase().includes(searchCity.toLowerCase()),
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
              onBlur={() => {
                // Delay hiding slightly to allow click events on dropdown item to fire first
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              placeholder={`${activeSearchCountry || current.country}에서 방문하고 싶은 도시를 입력해주세요.`}
            />

            {showSuggestions && fetchedRegions.length > 0 && (
              <div
                className="absolute top-14 left-10 right-10 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden py-2"
                style={{
                  maxHeight: '260px',
                  overflowY: 'auto',
                }}
              >
                {filteredRegions.length > 0 ? (
                  filteredRegions.map((region) => (
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
                      className="w-full px-5 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={colors.gray[400]}
                        strokeWidth="2"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <span
                        style={{
                          ...typography.body.BodyM,
                          color: colors.gray[800],
                        }}
                      >
                        {region.name}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="w-full px-5 py-3 text-gray-500 text-center text-sm">
                    검색 결과가 없습니다.
                  </div>
                )}
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
