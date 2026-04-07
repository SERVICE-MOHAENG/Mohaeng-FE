import { useState, useEffect, useMemo } from 'react';
import {
  Header,
  DestinationList,
  Destination,
  getAccessToken,
  getAllCountries,
  getMainCourses,
  colors,
  typography,
  useSurvey,
} from '@mohang/ui';
import type { FeedItem } from '@mohang/ui';

interface CountryOption {
  id?: string;
  name: string;
  code: string;
  countryCode?: string;
  continent?: string;
}

const FIXED_FILTER_COUNTRIES: CountryOption[] = [
  { name: '일본', code: 'JP' },
  { name: '미국', code: 'US' },
  { name: '프랑스', code: 'FR' },
  { name: '이탈리아', code: 'IT' },
  { name: '스페인', code: 'ES' },
  { name: '영국', code: 'GB' },
  { name: '독일', code: 'DE' },
];

const FIXED_FILTER_COUNTRY_CODES = new Set(
  FIXED_FILTER_COUNTRIES.map((country) => country.code),
);

export function DiscoverPage() {
  const { surveyData, updateSurveyData } = useSurvey();
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [feeds] = useState<FeedItem[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('JP');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortBy] = useState<'latest' | 'popular'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(Boolean(token && token !== 'undefined'));
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

        if (isMounted && Array.isArray(countryData) && countryData.length > 0) {
          setCountries(countryData);
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
    if (!surveyData.recentCountry) return;

    setSelectedCountry(surveyData.recentCountry.code);
    setSearchQuery(surveyData.recentCountry.name);

    setCountries((prev) => {
      const exists = prev.some((c) => c.code === surveyData.recentCountry?.code);
      if (exists) return prev;

      return [
        ...prev,
        {
          name: surveyData.recentCountry.name,
          code: surveyData.recentCountry.code,
        },
      ];
    });
  }, [surveyData.recentCountry]);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const res: any = await getMainCourses({
          sortBy,
          countryCode: selectedCountry,
          page: 1,
          limit: 5,
        });
        const data = res.data || res;
        const nextDestinations = ((data.courses || data.items || []) as any[]).map(
          (course) => ({
            id: course.id,
            title: course.title,
            duration:
              course.start_date && course.end_date
                ? `${Math.floor(
                    (new Date(course.end_date).getTime() -
                      new Date(course.start_date).getTime()) /
                      (1000 * 60 * 60 * 24),
                  ) + 1}일 일정`
                : '일정 정보 없음',
            description: course.description || course.summary || '',
            tags: course.tags || [],
            imageUrl: course.image_url || course.imageUrl || '',
            likeCount: course.like_count ?? course.likeCount ?? 0,
            isLiked: course.is_liked ?? course.isLiked ?? false,
            is_liked: course.is_liked ?? course.isLiked ?? false,
            isMyPlan:
              course.is_mine ?? course.is_owner ?? course.isMine ?? course.isOwner ?? false,
            userName: course.userName || course.authorName || course.author_name,
            authorName: course.authorName || course.author_name || course.userName,
          }),
        );
        setAllDestinations(nextDestinations);
        setCurrentPage(1);
        setPaginationInfo({
          total: Number(data.total) || nextDestinations.length,
          totalPages: Math.max(1, Math.ceil(nextDestinations.length / 5)),
        });
      } catch (error) {
        console.error('DiscoverPage fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [selectedCountry, sortBy, isLoggedIn]);

  useEffect(() => {
    const startIndex = Math.max(0, (currentPage - 1) * 5);
    setDestinations(allDestinations.slice(startIndex, startIndex + 5));
  }, [allDestinations, currentPage]);

  const filteredCountries = useMemo(
    () =>
      countries.filter((c) =>
        searchQuery.trim() === ''
          ? true
          : c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.code.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [countries, searchQuery],
  );

  const filterCountries = useMemo(() => {
    const baseCountries = FIXED_FILTER_COUNTRIES;

    if (
      surveyData.recentCountry?.name &&
      surveyData.recentCountry?.code &&
      !baseCountries.some((country) => country.code === surveyData.recentCountry?.code)
    ) {
      return [
        ...baseCountries,
        {
          name: surveyData.recentCountry.name,
          code: surveyData.recentCountry.code,
        },
      ];
    }

    return baseCountries;
  }, [countries, surveyData.recentCountry]);

  const handleCountryChange = (
    code: string,
    options?: { updateRecentCountry?: boolean },
  ) => {
    setSelectedCountry(code);
    setCurrentPage(1);

    if (
      options?.updateRecentCountry === false ||
      FIXED_FILTER_COUNTRY_CODES.has(code)
    ) {
      return;
    }

    const matchedCountry = countries.find((country) => country.code === code);
    const nextName = matchedCountry?.name;

    if (nextName) {
      updateSurveyData({
        recentCountry: {
          name: nextName,
          code,
        },
      });
    }
  };

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    const match =
      filteredCountries.find(
        (c) =>
          c.name.toLowerCase() === trimmed.toLowerCase() ||
          c.code.toLowerCase() === trimmed.toLowerCase(),
      ) || filteredCountries[0];

    if (match) {
      handleCountryChange(match.code, { updateRecentCountry: true });
      setSearchQuery(match.name);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} />

      <main className="mx-auto max-w-7xl px-8 py-10" style={{ zoom: '0.85' }}>
        <section className="mb-8">
          <h1
            className="mb-2"
            style={{
              ...typography.headline.LHeadlineM,
              color: colors.gray[800],
            }}
          >
            사람들이 생성한 인기있는
            <br />
            여행코스에요!
          </h1>
          <p style={{ ...typography.body.BodyM, color: colors.gray[400] }}>
            실제 경험을 바탕으로 코스를 짰어요!
          </p>
        </section>

        <section className="mb-8">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="방문하고 싶은 나라를 입력해주세요."
              className="h-14 w-full rounded-2xl border border-gray-100 pl-6 pr-16 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-100"
              style={{ ...typography.body.BodyM, color: colors.gray[700] }}
            />
            {showSuggestions && searchQuery.trim() && filteredCountries.length > 0 && (
              <div className="absolute left-0 top-16 z-50 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-xl">
                {filteredCountries.map((country) => (
                  <button
                    key={country.id || country.code}
                    onClick={() => {
                      handleCountryChange(country.code, {
                        updateRecentCountry: true,
                      });
                      setSearchQuery(country.name);
                      setShowSuggestions(false);
                    }}
                    className="w-full px-6 py-3 text-left transition-colors hover:bg-gray-50"
                    style={{ ...typography.body.BodyM, color: colors.gray[700] }}
                  >
                    {country.name}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cyan-400 text-white shadow-sm transition-colors hover:bg-cyan-500"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </section>

        <section className="mb-6">
          <div className="flex flex-wrap gap-3">
            {filterCountries.map((country) => (
              <button
                key={country.id || country.code}
                onClick={() => {
                  handleCountryChange(country.code, {
                    updateRecentCountry: false,
                  });
                  setSearchQuery(country.name);
                }}
                className={`rounded-full px-7 py-3 text-base font-bold transition-all ${
                  selectedCountry === country.code
                    ? 'bg-cyan-400 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {country.name}
              </button>
            ))}
          </div>
        </section>

        <section>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
            </div>
          ) : destinations.length > 0 ? (
            <DestinationList
              destinations={destinations}
              feeds={feeds}
              page={currentPage}
              totalPages={paginationInfo.totalPages}
              onPageChange={setCurrentPage}
              variant="list"
            />
          ) : (
            <div
              className="py-20 text-center"
              style={{ color: colors.gray[400], ...typography.body.LBodyM }}
            >
              해당 국가의 여행코스가 없습니다.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default DiscoverPage;
