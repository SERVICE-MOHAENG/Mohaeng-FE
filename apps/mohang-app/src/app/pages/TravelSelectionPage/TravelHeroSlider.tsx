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
        <span className="text-xl md:text-3xl text-gray-800 font-bold mb-1">
          &lt;
        </span>
      </button>

      <button
        onClick={onNext}
        className="absolute right-[5%] md:right-[15%] lg:right-[20%] top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-white/80 hover:bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 z-30"
        aria-label="다음 여행지 보기"
      >
        <span className="text-xl md:text-3xl text-gray-800 font-bold mb-1">
          &gt;
        </span>
      </button>

      {/* 슬라이드 컨텐츠 컨테이너 */}
      <div className="flex items-center w-full justify-center gap-1 md:gap-2">
        {/* 이전 이미지 - 강조를 위해 크기 축소 및 흐림 효과 */}
        <motion.div
          key={`prev-${currentIndex}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 0.75, x: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="hidden sm:block w-[12%] md:w-[180px] h-[25vh] md:h-[35vh] overflow-hidden shrink-0 rounded-xl grayscale opacity-40 blur-[2px] transition-all"
        >
          <img
            src={travelData[getIndex(-1)].img}
            className="w-full h-full object-cover"
            alt={`${travelData[getIndex(-1)].country} 미리보기`}
          />
        </motion.div>

        {/* 메인 이미지 - 크기 확대 및 그림자 강조 */}
        <div className="relative w-[90%] sm:w-[60%] md:w-[700px] h-[40vh] md:h-[60vh] max-h-[480px] overflow-hidden shrink-0 z-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl border-4 border-white transition-all duration-500">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full relative"
            >
              <img
                src={current.img}
                className="w-full h-full object-cover"
                alt={`${current.country} 이미지`}
              />
              <div className="absolute inset-0 bg-black/5 pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 다음 이미지 - 강조를 위해 크기 축소 및 흐림 효과 */}
        <motion.div
          key={`next-${currentIndex}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 0.75, x: -20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="hidden sm:block w-[12%] md:w-[180px] h-[25vh] md:h-[35vh] overflow-hidden shrink-0 rounded-xl grayscale opacity-40 blur-[2px] transition-all"
        >
          <img
            src={travelData[getIndex(1)].img}
            className="w-full h-full object-cover"
            alt={`${travelData[getIndex(1)].country} 미리보기`}
          />
        </motion.div>
      </div>
    </div>
  );
}
