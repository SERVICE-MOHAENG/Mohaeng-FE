import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, typography } from '@mohang/ui';
import { Header } from '@mohang/ui';

// 1. 데이터 확장 (5개국 및 국기 이모지)
const travelData = [
  {
    id: 0,
    country: '미국 🇺🇸',
    desc: '광활한 자연과 다양한 문화가 공존하는 나라, 미국.',
    img: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1000',
  },
  {
    id: 1,
    country: '일본 🇯🇵',
    desc: '전통과 현대가 어우러진 매력적인 섬나라, 일본.',
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000',
  },
  {
    id: 2,
    country: '프랑스 🇫🇷',
    desc: '예술과 낭만이 가득한 유럽의 중심, 프랑스.',
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000',
  },
  {
    id: 3,
    country: '대한민국 🇰🇷',
    desc: '아름다운 사계절과 역동적인 에너지가 넘치는 한국.',
    img: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1000',
  },
  {
    id: 4,
    country: '이탈리아 🇮🇹',
    desc: '역사와 예술, 그리고 미식의 천국 이탈리아.',
    img: 'https://images.unsplash.com/photo-1529260839312-41777c08238d?auto=format&fit=crop&w=1000',
  },
];

export function TravelSelectionPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  console.log(recentSearches);

  const handleSearch = () => {
    if (!searchValue.trim() || searchValue.trim().length >= 8) return;
    setRecentSearches((prev) => [...prev, searchValue]);
    console.log(recentSearches);

    setSearchValue('');
  };

  const handleRemoveRecentSearch = (index: number) => {
    setRecentSearches((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? travelData.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === travelData.length - 1 ? 0 : prev + 1));

  const getIndex = (offset: number) =>
    (currentIndex + offset + travelData.length) % travelData.length;

  const current = travelData[currentIndex];

  return (
    <div
      className="bg-white flex flex-col overflow-hidden relative font-sans"
      style={{ minHeight: 'calc(100vh / 0.85)', zoom: '0.85' }}
    >
      <Header />

      <main className="h-full flex-1 flex flex-col items-center justify-start relative overflow-hidden">
        {/* 1. 초대형 슬라이드 섹션 */}
        <div className="relative w-full h-[50vh] flex justify-center items-start group mb-4">
          {/* 좌우 그라데이션 오버레이 */}
          <div className="absolute left-0 top-0 w-40 h-full z-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 w-40 h-full z-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />

          {/* 슬라이드 내부 내비게이션 버튼 (메인 이미지 밖으로 배치) */}
          <button
            onClick={handlePrev}
            className="absolute left-[15%] md:left-[20%] top-1/2 -translate-y-1/2 w-14 h-14 bg-white/80 hover:bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 z-30"
          >
            <span className="text-3xl text-gray-800 font-bold mb-1">&lt;</span>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-[15%] md:right-[20%] top-1/2 -translate-y-1/2 w-14 h-14 bg-white/80 hover:bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 z-30"
          >
            <span className="text-3xl text-gray-800 font-bold mb-1">&gt;</span>
          </button>

          {/* 슬라이드 컨텐츠 컨테이너 */}
          <div className="flex items-center gap-10 w-[100%] justify-center">
            {/* 이전 이미지 */}
            <div className="w-[25%] h-[55vh] opacity-80 blur-[3px] overflow-hidden shrink-0 transition-transform duration-500">
              <img
                src={travelData[getIndex(-1)].img}
                className="w-full h-full object-cover"
                alt=""
              />
            </div>

            {/* 메인 이미지 (버튼이 빠져나간 깔끔한 상태) */}
            <div className="relative w-full md:w-[700px] h-[55vh] max-h-[400px] overflow-hidden shadow-2xl shrink-0 z-10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={current.img}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>

            {/* 다음 이미지 */}
            <div className="w-[25%] h-[55vh] opacity-20 blur-[3px] overflow-hidden shrink-0 transition-transform duration-500">
              <img
                src={travelData[getIndex(1)].img}
                className="w-full h-full object-cover"
                alt=""
              />
            </div>
          </div>
        </div>

        {/* 2. 슬라이드 바 (인디케이터) */}
        <div className="flex gap-2 mt-10 mb-4 items-center">
          {travelData.map((item, idx) => (
            <motion.div
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              animate={{
                width: 36,
                backgroundColor: currentIndex === idx ? '#525252' : '#E4E4E7',
              }}
              className="h-1 rounded-full cursor-pointer transition-colors duration-300"
            />
          ))}
        </div>

        {/* 3. 텍스트 정보 */}
        <div className="flex flex-col items-center w-full max-w-xl z-30">
          <motion.div
            key={currentIndex}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col gap-2 text-center mb-6"
          >
            <p
              className="text-xl font-bold tracking-tight"
              style={typography.title.sTitleB}
            >
              {current.country}
            </p>
            <p
              className="text-gray-400 font-medium text-sm md:text-base px-10"
              style={typography.body.BodyM}
            >
              {current.desc}
            </p>
          </motion.div>

          {/* 검색바 */}
          <div ref={containerRef} className="w-full px-10 relative mb-8">
            <input
              type="text"
              placeholder={`${current.country.split(' ')[0]}에서 방문하고 싶은 도시를 입력해주세요.`}
              className="w-full h-14 pl-8 pr-16 rounded-xl border-2 bg-gray-200 focus:ring-4 focus:ring-cyan-50/50 focus:bg-white outline-none text-base md:text-lg"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
              className="absolute right-12 top-1/2 -translate-y-1/2 bg-cyan-400 w-10 h-10 rounded-full text-white flex items-center justify-center hover:bg-cyan-500 shadow-md transition-transform active:scale-90"
              onClick={handleSearch}
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
        </div>

        {/* 최근 검색어 */}
        <div className="flex justify-center gap-4 w-2/3">
          {recentSearches.slice(-7).map((search, index) => {
            const realIndex = recentSearches.length - 7 + index;
            return (
              <div
                key={index}
                className="flex items-center gap-2 border rounded-lg px-4 py-2 shrink-0"
                style={{
                  borderColor: colors.primary[500],
                  ...typography.body.BodyB,
                }}
              >
                <p
                  className="whitespace-nowrap"
                  style={{ color: colors.primary[500] }}
                >
                  {search}
                </p>
                <button
                  onClick={() => handleRemoveRecentSearch(realIndex)}
                  style={{ color: colors.primary[500] }}
                >
                  X
                </button>
              </div>
            );
          })}
        </div>

        {/* 다음 버튼 */}
        <div className="absolute bottom-12 right-12">
          <button
            className="px-12 py-3.5 rounded-lg text-white font-bold text-lg transition-all hover:-translate-y-1 active:scale-95"
            style={{ backgroundColor: colors.primary[500] }}
          >
            다음
          </button>
        </div>
      </main>
    </div>
  );
}

export default TravelSelectionPage;
