import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';
import {
  Header,
  LoadingScreen,
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

interface CountryOption {
  id: string;
  name: string;
  code: string;
  countryCode: string;
  imageUrl?: string | null;
  continent?: string;
}

interface SliderCountry {
  id: string;
  country: string;
  code: string;
  countryCode: string;
  continent?: string;
  flagImg: string;
  desc: string;
  img: string;
}

const FALLBACK_COUNTRY_IMAGE =
  'https://images.pexels.com/photos/9782676/pexels-photo-9782676.jpeg';

const preloadImage = (src?: string | null) =>
  new Promise<void>((resolve) => {
    if (!src) {
      resolve();
      return;
    }

    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });

const getCountryDescription = (country: CountryOption) => {
  if (country.continent) {
    return `${country.continent}의 다채로운 분위기와 여행 매력을 경험해보세요.`;
  }

  return `${country.name}에서 새로운 도시와 여행지를 찾아보세요.`;
};

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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isCountriesFetched, setIsCountriesFetched] = useState(false);

  const selectedRegionNames = (surveyData.regions || []).map((r) => r.region);
  const MAX_REGIONS = 8;

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token && token !== 'undefined');
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchCountries = async () => {
      try {
        const response: any = await getAllCountries();
        const countryData =
          response?.countries ||
          response?.data?.countries ||
          response?.data?.data?.countries ||
          [];

        if (isMounted) {
          setCountries(Array.isArray(countryData) ? countryData : []);
          setIsCountriesFetched(true);
        }
      } catch {
        if (isMounted) {
          setCountries([]);
          setIsCountriesFetched(true);
        }
      }
    };

    fetchCountries();

    return () => {
      isMounted = false;
    };
  }, []);

  const sliderCountries = useMemo<SliderCountry[]>(() => {
    return countries.map((country) => {
      const flagCode = (country.code || '').toLowerCase();

      return {
        id: country.id,
        country: country.name,
        code: country.code,
        countryCode: country.countryCode,
        continent: country.continent,
        flagImg: flagCode ? `https://flagcdn.com/w40/${flagCode}.png` : '',
        desc: getCountryDescription(country),
        img: country.imageUrl || FALLBACK_COUNTRY_IMAGE,
      };
    });
  }, [countries]);

  const current = sliderCountries[currentIndex] || null;

  useEffect(() => {
    if (!current?.country) return;

    if (activeSearchCountry === current.country) {
      return;
    }

    setActiveSearchCountry(current.country);
  }, [current?.country, activeSearchCountry]);

  useEffect(() => {
    let isMounted = true;

    const preloadAllImages = async () => {
      if (!isCountriesFetched) return;

      if (sliderCountries.length === 0) {
        if (isMounted) {
          setIsInitialLoading(false);
        }
        return;
      }

      const urls = Array.from(
        new Set(sliderCountries.map((country) => country.img).filter(Boolean)),
      );

      await Promise.all(urls.map((url) => preloadImage(url)));

      if (isMounted) {
        setIsInitialLoading(false);
      }
    };

    preloadAllImages();

    return () => {
      isMounted = false;
    };
  }, [isCountriesFetched, sliderCountries]);

  useEffect(() => {
    if (sliderCountries.length === 0) return;
    if (currentIndex < sliderCountries.length) return;
    setCurrentIndex(0);
  }, [currentIndex, sliderCountries.length]);

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
    if (
      surveyData.recentCountry?.name === activeSearchCountry &&
      surveyData.recentCountry?.code === code
    ) {
      return;
    }

    updateSurveyData({
      recentCountry: { name: activeSearchCountry, code },
    });
  }, [activeSearchCountry, countries, surveyData.recentCountry, updateSurveyData]);

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

  const selectCountry = (countryName: string) => {
    setActiveSearchCountry(countryName);
    setSearchCountry(countryName);

    const matchedIndex = sliderCountries.findIndex(
      (item) => item.country === countryName,
    );
    if (matchedIndex >= 0) {
      setCurrentIndex(matchedIndex);
    }
  };

  const handlePrev = () => {
    if (sliderCountries.length === 0) return;
    setCurrentIndex((prev) =>
      prev === 0 ? sliderCountries.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    if (sliderCountries.length === 0) return;
    setCurrentIndex((prev) =>
      prev === sliderCountries.length - 1 ? 0 : prev + 1,
    );
  };

  const handleSearchCountry = (rawValue?: string) => {
    const trimmed = (rawValue ?? searchCountry).trim();
    if (!trimmed) return;

    const matchedCountry =
      filteredCountries.find((country) => country.name === trimmed) ||
      filteredCountries[0];

    if (!matchedCountry) return;

    selectCountry(matchedCountry.name);
    setShowCountrySuggestions(false);
  };

  const handleSearchCity = (rawValue?: string) => {
    const trimmed = (rawValue ?? searchCity).trim();
    if (!trimmed) return;

    if (!activeSearchCountry) {
      showAlert('방문할 나라를 먼저 선택해주세요.', 'warning');
      return;
    }

    const matchedRegion = fetchedRegions.find(
      (region) => region.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );

    if (!matchedRegion) {
      showAlert('목록에 있는 도시만 선택할 수 있습니다.', 'warning');
      return;
    }

    const suggestedRegion = matchedRegion.name;

    if (
      !selectedRegionNames.includes(suggestedRegion) &&
      selectedRegionNames.length >= MAX_REGIONS
    ) {
      showAlert('도시는 최대 8개까지만 선택할 수 있습니다.', 'warning');
      return;
    }

    if (!selectedRegionNames.includes(suggestedRegion)) {
      const currentRegions = surveyData.regions || [];
      updateSurveyData({
        regions: [
          ...currentRegions,
          { region: suggestedRegion, start_date: '', end_date: '' },
        ],
      });
    }

    setSearchCity('');
    setShowSuggestions(false);
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

  if (isInitialLoading) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-white">
        <Header isLoggedIn={isLoggedIn} />
        <LoadingScreen
          message="여행지를 준비하고 있습니다."
          description="국가 이미지와 추천 정보를 불러오는 중입니다."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Header isLoggedIn={isLoggedIn} />

      <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-[1180px] flex-col overflow-y-auto px-4 pb-32 pt-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:px-6">
        <div className="relative mx-auto w-full max-w-[520px] shrink-0">
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
              className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[#dff3fb] bg-white py-2 shadow-[0_20px_45px_rgba(15,23,42,0.08)]"
              style={{ maxHeight: '240px', overflowY: 'auto' }}
            >
              {filteredCountries.map((country) => (
                <button
                  key={country.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={() => {
                    selectCountry(country.name);
                    setShowCountrySuggestions(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f3fbff]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eefaff] text-[#00BFFF]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">{country.name}</div>
                    <div className="text-xs text-gray-400">{country.continent || country.countryCode || country.code}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex min-h-0 flex-1 flex-col items-center overflow-visible">
          <div className="w-full max-w-[1080px] shrink-0">
            <TravelHeroSlider
              currentIndex={currentIndex}
              onPrev={handlePrev}
              onNext={handleNext}
              travelData={sliderCountries}
            />
          </div>

          <div className="mt-4 shrink-0 sm:mt-5">
            <TravelIndicator
              currentIndex={currentIndex}
              total={sliderCountries.length}
              onSelect={setCurrentIndex}
              isItemSelected={(idx) => activeSearchCountry === sliderCountries[idx]?.country}
            />
          </div>

          {current ? (
            <div className="mt-3 shrink-0 sm:mt-4">
              <TravelInfo
                {...current}
                currentIndex={currentIndex}
                onSelect={(country) => {
                  if (activeSearchCountry === country) {
                    setActiveSearchCountry('');
                  } else {
                    selectCountry(country);
                  }
                }}
                isSelected={activeSearchCountry === current.country}
              />
            </div>
          ) : null}

          <div className="mt-4 flex w-full max-w-[620px] shrink-0 flex-col items-center sm:mt-5">
            <div className="relative w-full">
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
                  className="absolute bottom-full left-0 right-0 z-40 mb-2 overflow-hidden rounded-2xl border border-[#dff3fb] bg-white py-2 shadow-[0_20px_45px_rgba(15,23,42,0.08)]"
                  style={{ maxHeight: '220px', overflowY: 'auto' }}
                >
                  {filteredRegions.length > 0 ? (
                    filteredRegions.map((region) => (
                      <button
                        key={region.id}
                        type="button"
                        onMouseDown={(event) => {
                          event.preventDefault();
                        }}
                        onClick={() => {
                          if (
                            !selectedRegionNames.includes(region.name) &&
                            selectedRegionNames.length >= MAX_REGIONS
                          ) {
                            showAlert(
                              '도시는 최대 8개까지만 선택할 수 있습니다.',
                              'warning',
                            );
                            return;
                          }
                          if (!selectedRegionNames.includes(region.name)) {
                            const currentRegions = surveyData.regions || [];
                            updateSurveyData({
                              regions: [
                                ...currentRegions,
                                { region: region.name, start_date: '', end_date: '' },
                              ],
                            });
                          }
                          setShowSuggestions(false);
                          setSearchCity('');
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f3fbff]"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eefaff] text-[#00BFFF]">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-800">{region.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-sm text-gray-500">검색 결과가 없습니다.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedRegionNames.length > 0 ? (
            <div className="mt-5 flex min-h-[64px] w-full max-w-[760px] shrink-0 flex-col items-center overflow-visible">
              <RecentSearchList
                searches={selectedRegionNames}
                onRemove={(i) => handleRemoveRegion(selectedRegionNames[i])}
              />
            </div>
          ) : (
            <div className="mt-5 min-h-[64px] w-full max-w-[760px] shrink-0 pb-20" />
          )}
        </div>
      </main>

      <footer className="pointer-events-none fixed bottom-6 left-0 flex w-full justify-end px-4 sm:bottom-10 sm:px-12">
        <button
          type="button"
          onClick={handleNextStep}
          disabled={isNextDisabled}
          className="pointer-events-auto rounded-lg px-6 py-2 text-sm text-white shadow-sm transition-all active:scale-95 disabled:opacity-40 sm:px-8 sm:text-base"
          style={{
            backgroundColor: isNextDisabled
              ? colors.primary[200]
              : colors.primary[500],
            ...typography.body.BodyM,
          }}
        >
          다음
        </button>
      </footer>
    </div>
  );
}

export default TravelSelectionPage;
