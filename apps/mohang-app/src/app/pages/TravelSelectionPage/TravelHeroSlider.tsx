import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  travelData: any[];
}

export function TravelHeroSlider({
  currentIndex,
  onPrev,
  onNext,
  travelData,
}: Props) {
  if (travelData.length === 0) {
    return null;
  }

  const getIndex = (offset: number) =>
    (currentIndex + offset + travelData.length) % travelData.length;

  const current = travelData[currentIndex];

  return (
    <div className="relative w-full flex justify-center items-start group mb-3 overflow-hidden">
      {/* 좌우 그라데이션 오버레이 - 반응형 너비 조절 */}
      <div className="absolute left-0 top-0 w-10 md:w-40 h-full z-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 w-10 md:w-40 h-full z-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />

      {/* 슬라이드 내부 내비게이션 버튼 - 반응형 위치 조절 */}
      <button
        onClick={onPrev}
        className="absolute left-[5%] md:left-[15%] lg:left-[20%] top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-white/80 hover:bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 z-30"
        aria-label="이전 여행지 보기"
      >
        <span className="text-xl md:text-3xl text-gray-800 font-bold mb-1">&lt;</span>
      </button>

      <button
        onClick={onNext}
        className="absolute right-[5%] md:right-[15%] lg:right-[20%] top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-white/80 hover:bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 z-30"
        aria-label="다음 여행지 보기"
      >
        <span className="text-xl md:text-3xl text-gray-800 font-bold mb-1">&gt;</span>
      </button>

      {/* 슬라이드 컨텐츠 컨테이너 */}
      <div className="flex items-center w-full justify-center">
        {/* 이전 이미지 - 모바일에서 축소 */}
        <div className="hidden sm:block w-[15%] md:w-[28%] h-[30vh] md:h-[55vh] opacity-30 md:opacity-80 blur-[2px] md:blur-[3px] overflow-hidden shrink-0 transition-all duration-500">
          <img
            src={travelData[getIndex(-1)].img}
            className="w-full h-full object-cover"
            alt={`${travelData[getIndex(-1)].country} 미리보기`}
          />
        </div>

        {/* 메인 이미지 - 너비 최적화 */}
        <div className="relative w-[85%] sm:w-[50%] md:w-[700px] h-[35vh] md:h-[55vh] max-h-[400px] overflow-hidden shrink-0 z-10 shadow-2xl rounded-2xl mx-1 md:mx-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full h-full relative"
            >
              <img
                src={current.img}
                className="w-full h-full object-cover"
                alt={`${current.country} 이미지`}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 다음 이미지 - 모바일에서 축소 */}
        <div className="hidden sm:block w-[15%] md:w-[28%] h-[30vh] md:h-[55vh] opacity-30 md:opacity-80 blur-[2px] md:blur-[3px] overflow-hidden shrink-0 transition-all duration-500">
          <img
            src={travelData[getIndex(1)].img}
            className="w-full h-full object-cover"
            alt={`${travelData[getIndex(1)].country} 미리보기`}
          />
        </div>
      </div>
    </div>
  );
}
