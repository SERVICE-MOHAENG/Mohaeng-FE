import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';
import {
  Header,
  useSurvey,
  getAccessToken,
  colors,
  typography,
  getAllCountries,
  getCountries,
} from '@mohang/ui';
import { TravelHeroSlider } from './TravelHeroSlider';
import { TravelInfo } from './TravelInfo';
import { TravelSearchBar } from './TravelSearchBar';
import { RecentSearchList } from './RecentSearchList';
import { TravelIndicator } from './TravelIndicator';
import { travelData } from './travelData';

interface CountryOption {
  id: string;
  name: string;
  code: string;
  countryCode: string;
  imageUrl?: string | null;
  continent?: string;
}

export function TravelSelectionPage() {
  const { surveyData, updateSurveyData } = useSurvey();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchCountry, setSearchCountry] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSearchCountry, setActiveSearchCountry] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [fetchedRegions, setFetchedRegions] = useState<
    { id: string; name: string; imageUrl: string }[]
  >([]);

  const current = travelData[currentIndex] || travelData[0];
  const selectedRegionNames = (surveyData.regions || []).map((r) => r.region);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token && token !== 'undefined');
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchCountries = async () => {
      try {
        const response: any = await getAllCountries();
        const countryData = response?.countries || response?.data?.countries || [];

        if (isMounted) {
          setCountries(Array.isArray(countryData) ? countryData : []);
        }
      } catch {
        if (isMounted) {
          setCountries([]);
        }
      }
    };

    fetchCountries();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchRegions = async () => {
      if (!activeSearchCountry) {
        if (isMounted) setFetchedRegions([]);
        return;
      }

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
      } catch {
        if (isMounted) setFetchedRegions([]);
      }
    };

    fetchRegions();
    return () => {
      isMounted = false;
    };
  }, [activeSearchCountry]);

  useEffect(() => {
    if (!activeSearchCountry) return;

    const selectedCountry = countries.find(
      (country) => country.name === activeSearchCountry,
    );
    const code = selectedCountry?.countryCode || selectedCountry?.code;
    if (!code) return;

    updateSurveyData({
      recentCountry: { name: activeSearchCountry, code },
    });
  }, [activeSearchCountry, countries, updateSurveyData]);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? travelData.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === travelData.length - 1 ? 0 : prev + 1));

  const filteredCountries = useMemo(
    () =>
      countries.filter((item) =>
        searchCountry.trim() === ''
          ? true
          : item.name.toLowerCase().includes(searchCountry.toLowerCase()),
      ),
    [countries, searchCountry],
  );

  const filteredRegions = useMemo(
    () =>
      fetchedRegions.filter((region) =>
        searchCity.trim() === ''
          ? true
          : region.name.toLowerCase().includes(searchCity.toLowerCase()),
      ),
    [fetchedRegions, searchCity],
  );

  const handleSearchCountry = () => {
    const trimmed = searchCountry.trim();
    if (!trimmed) return;

    const matchedCountry = countries.find((country) => country.name === trimmed);
    const nextCountryName = matchedCountry?.name || trimmed;

    setActiveSearchCountry(nextCountryName);
    setSearchCountry(nextCountryName);

    const matchedIndex = travelData.findIndex(
      (item) => item.country === nextCountryName,
    );
    if (matchedIndex >= 0) {
      setCurrentIndex(matchedIndex);
    }

    setShowCountrySuggestions(false);
  };

  const handleSearchCity = () => {
    const trimmed = searchCity.trim();
    if (!trimmed) return;

    if (!activeSearchCountry) {
      showAlert('방문할 나라를 먼저 선택해주세요.', 'warning');
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
      showAlert('최소 하나 이상의 여행지를 선택해주세요.', 'warning');
      return;
    }
    navigate('/calendar');
  };

  const isNextDisabled = surveyData.regions.length === 0;

  return (
    <div className="bg-white flex flex-col font-sans min-h-screen">
      <Header isLoggedIn={isLoggedIn} />

      <main className="flex-1 flex flex-col items-center py-6 md:py-8 relative w-full overflow-x-hidden">
        <div className="w-full max-w-2xl px-6 z-30 mb-6">
          <div className="relative">
            <TravelSearchBar
              value={searchCountry}
              onChange={setSearchCountry}
              onSearch={handleSearchCountry}
              onFocus={() => setShowCountrySuggestions(true)}
              onBlur={() => {
                setTimeout(() => setShowCountrySuggestions(false), 200);
              }}
              placeholder="방문하고 싶은 나라를 입력해주세요."
            />

            {showCountrySuggestions && filteredCountries.length > 0 && (
              <div
                className="absolute top-full left-10 right-10 mt-3 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden py-2"
                style={{
                  maxHeight: '260px',
                  overflowY: 'auto',
                }}
              >
                {filteredCountries.map((country) => (
                  <button
                    key={country.id}
                    onClick={() => {
                      setActiveSearchCountry(country.name);
                      setSearchCountry(country.name);

                      const matchedIndex = travelData.findIndex(
                        (item) => item.country === country.name,
                      );
                      if (matchedIndex >= 0) {
                        setCurrentIndex(matchedIndex);
                      }

                      setShowCountrySuggestions(false);
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
                      {country.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
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
