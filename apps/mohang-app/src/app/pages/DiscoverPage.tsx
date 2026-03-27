import { useState, useEffect } from 'react';
import {
  Header,
  DestinationList,
  Destination,
  getAccessToken,
  getMainCourses,
  addLike,
  removeLike,
  colors,
  typography,
  useSurvey,
} from '@mohang/ui';
import type { FeedItem } from '@mohang/ui';

const INITIAL_COUNTRIES = [
  { name: '일본', code: 'JP' },
  { name: '미국', code: 'US' },
  { name: '프랑스', code: 'FR' },
  { name: '이탈리아', code: 'IT' },
  { name: '스페인', code: 'ES' },
  { name: '영국', code: 'GB' },
  { name: '독일', code: 'DE' },
  { name: '몽골', code: 'MN' },
];

export function DiscoverPage() {
  const { surveyData } = useSurvey();
  const [countries, setCountries] = useState(INITIAL_COUNTRIES);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('JP');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortBy] = useState<'latest' | 'popular'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    totalPages: 0,
  });
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(Boolean(token && token !== 'undefined'));
  }, []);

  useEffect(() => {
    if (surveyData.recentCountry) {
      const exists = INITIAL_COUNTRIES.some(
        (c) => c.code === surveyData.recentCountry?.code,
      );
      if (!exists) {
        // Replace "몽골" with recent country if it's not in the initial list
        const updated = [...INITIAL_COUNTRIES];
        updated[7] = surveyData.recentCountry;
        setCountries(updated);
      }
      setSelectedCountry(surveyData.recentCountry.code);
    }
  }, [surveyData.recentCountry]);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const res: any = await getMainCourses({
          sortBy,
          countryCode: selectedCountry,
          page: currentPage,
          limit: 5,
        });
        console.log('getMainCourses', res);
        const data = res.data || res;
        setDestinations(data.courses || data.items || []);
        setPaginationInfo({
          total: data.total || 0,
          totalPages: data.totalPages || 0,
        });
      } catch (error) {
        console.error('DiscoverPage fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [selectedCountry, sortBy, currentPage, isLoggedIn]);

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    setCurrentPage(1);
  };

  const handleAddLike = async () => {
    if (!selectedCourseId) return;
    try {
      if (isLiked) {
        await removeLike(selectedCourseId);
      } else {
        await addLike(selectedCourseId);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Like failed', error);
    }
  };

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    const match = countries.find(
      (c) =>
        c.name.includes(trimmed) ||
        c.code.toLowerCase() === trimmed.toLowerCase(),
    );
    if (match) {
      handleCountryChange(match.code);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} />

      <main className="max-w-7xl mx-auto px-8 py-10" style={{ zoom: '0.85' }}>
        {/* Page Title */}
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

        {/* Search Bar */}
        <section className="mb-8">
          <div className="w-full max-w-2xl relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="방문하고 싶은 나라를 입력해주세요."
              className="w-full h-14 pl-6 pr-16 rounded-2xl border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
              style={{ ...typography.body.BodyM, color: colors.gray[700] }}
            />
            {showSuggestions && searchQuery.trim() && (
              <div className="absolute top-16 left-0 w-full bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-50 py-2">
                {countries.filter(
                  (c) =>
                    c.name.includes(searchQuery) ||
                    c.code.toLowerCase().includes(searchQuery.toLowerCase()),
                ).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      handleCountryChange(c.code);
                      setSearchQuery(c.name);
                      setShowSuggestions(false);
                    }}
                    className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors"
                    style={{ ...typography.body.BodyM, color: colors.gray[700] }}
                  >
                    {c.name} ({c.code})
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-cyan-400 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-cyan-500 transition-colors shadow-sm"
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

        {/* Country Filter */}
        <section className="mb-6">
          <div className="flex gap-3 flex-wrap">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountryChange(country.code)}
                className={`px-7 py-3 rounded-full font-bold text-base transition-all ${
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

        {/* Course List */}
        <section>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
            </div>
          ) : destinations.length > 0 ? (
            <DestinationList
              destinations={destinations}
              feeds={feeds}
              onAddLike={handleAddLike}
              page={currentPage}
              totalPages={paginationInfo.totalPages}
              onPageChange={setCurrentPage}
              onActiveIdChange={(id) => setSelectedCourseId(id)}
            />
          ) : (
            <div
              className="text-center py-20"
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
