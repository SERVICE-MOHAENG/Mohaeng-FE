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

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  일본: 'JP',
  미국: 'US',
  프랑스: 'FR',
  이탈리아: 'IT',
  스페인: 'ES',
  영국: 'GB',
  독일: 'DE',
  몽골: 'MN',
  대한민국: 'KR',
  한국: 'KR',
  중국: 'CN',
  베트남: 'VN',
  태국: 'TH',
  대만: 'TW',
  홍콩: 'HK',
  싱가포르: 'SG',
  필리핀: 'PH',
  말레이시아: 'MY',
  인도네시아: 'ID',
  라오스: 'LA',
  호주: 'AU',
  캐나다: 'CA',
  멕시코: 'MX',
  브라질: 'BR',
  스위스: 'CH',
  오스트리아: 'AT',
  포르투갈: 'PT',
  네덜란드: 'NL',
  벨기에: 'BE',
  덴마크: 'DK',
  스웨덴: 'SE',
  노르웨이: 'NO',
  핀란드: 'FI',
  튀르키예: 'TR',
  그리스: 'GR',
  러시아: 'RU',
  인도: 'IN',
  이집트: 'EG',
};

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
      // Only fetch if we have an active search country
      if (activeSearchCountry) {
        if (isMounted) setFetchedRegions([]);
        try {
          const response: any = await getCountries(activeSearchCountry);
          const regionsData =
            response.data?.regions ||
            response.regions ||
            response.data?.data?.regions;
          const regions = Array.isArray(regionsData) ? regionsData : [];
          if (isMounted) {
            setFetchedRegions(regions);
          }
        } catch (e) {
          if (isMounted) setFetchedRegions([]);
        }
      } else {
        // Clear regions if no country is selected
        if (isMounted) setFetchedRegions([]);
      }
    };
    fetchRegions();
    return () => {
      isMounted = false;
    };
  }, [activeSearchCountry]);

  useEffect(() => {
    if (activeSearchCountry) {
      const code = COUNTRY_NAME_TO_CODE[activeSearchCountry];
      if (!code) return;

      updateSurveyData({
        recentCountry: { name: activeSearchCountry, code },
      });
    }
  }, [activeSearchCountry]);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? travelData.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === travelData.length - 1 ? 0 : prev + 1));

  const handleSearchCountry = () => {
    const trimmed = searchCountry.trim();
    if (!trimmed) return;

    setActiveSearchCountry(trimmed);
  };

  const handleSearchCity = () => {
    const trimmed = searchCity.trim();
    if (!trimmed) return;

    if (!activeSearchCountry) {
      alert('방문할 나라를 먼저 선택해주세요.');
      return;
    }

    if (!selectedRegionNames.includes(trimmed)) {
      const currentRegions = surveyData.regions || [];
      updateSurveyData({
        regions: [
          ...currentRegions,
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
    <div className="bg-white flex flex-col font-sans min-h-screen">
      <Header isLoggedIn={isLoggedIn} />

      <main
        className="flex-1 flex flex-col items-center py-6 md:py-8 relative w-full overflow-x-hidden"
      >
        <div className="w-full max-w-2xl px-6 z-30 mb-6">
          <TravelSearchBar
            value={searchCountry}
            onChange={setSearchCountry}
            onSearch={handleSearchCountry}
            placeholder={`방문하고 싶은 나라를 입력해주세요.`}
          />
        </div>

        <div className="w-full flex-1 flex flex-col items-center justify-center gap-8">
          <div className="w-full">
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
          </div>

          <div className="flex flex-col items-center w-full max-w-2xl z-30 px-6">
            <TravelInfo
              {...current}
              currentIndex={currentIndex}
              onSelect={(country) => {
                if (activeSearchCountry === country) {
                  setActiveSearchCountry('');
                } else {
                  setActiveSearchCountry(country);
                }
                setSearchCountry('');
              }}
              isSelected={activeSearchCountry === current.country}
            />
            <div className="w-full relative mt-4">
              <TravelSearchBar
                value={searchCity}
                onChange={setSearchCity}
                onSearch={handleSearchCity}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder={
                  activeSearchCountry
                    ? `${activeSearchCountry}에서 방문하고 싶은 도시를 입력해주세요.`
                    : '방문하고 싶은 나라를 먼저 검색해주세요.'
                }
              />

              {showSuggestions && fetchedRegions.length > 0 && (
                <div
                  className="absolute bottom-20 left-10 right-10 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden py-2"
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
                            const currentRegions = surveyData.regions || [];
                            updateSurveyData({
                              regions: [
                                ...currentRegions,
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
        </div>

        <div className="w-full mt-8 mb-16 flex justify-center">
          <RecentSearchList
            searches={selectedRegionNames}
            onRemove={(i) => handleRemoveRegion(selectedRegionNames[i])}
          />
        </div>

        <div className="fixed bottom-6 md:bottom-10 right-6 md:right-12 z-40">
          <button
            onClick={handleNextStep}
            disabled={isNextDisabled}
            className={`px-6 md:px-8 py-2 md:py-3 rounded-xl text-white font-bold text-base md:text-lg transition-all active:scale-95 shadow-xl ${
              isNextDisabled
                ? 'opacity-50 cursor-not-allowed grayscale'
                : 'hover:-translate-y-1 hover:brightness-110'
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
