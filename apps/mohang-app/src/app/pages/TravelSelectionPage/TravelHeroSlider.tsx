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
    <div className="relative w-full h-[50vh] flex justify-center items-start group mb-3">
      {/* 좌우 그라데이션 오버레이 */}
      <div className="absolute left-0 top-0 w-40 h-[80vh] z-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 w-40 h-[80vh] z-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />

      {/* 슬라이드 내부 내비게이션 버튼 (메인 이미지 밖으로 배치) */}
      <button
        onClick={onPrev}
        className="absolute left-[15%] md:left-[20%] top-1/2 -translate-y-1/2 w-14 h-14 bg-white/80 hover:bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 z-30"
        aria-label="이전 여행지 보기"
      >
        <span className="text-3xl text-gray-800 font-bold mb-1">&lt;</span>
      </button>

      <button
        onClick={onNext}
        className="absolute right-[15%] md:right-[20%] top-1/2 -translate-y-1/2 w-14 h-14 bg-white/80 hover:bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 z-30"
        aria-label="다음 여행지 보기"
      >
        <span className="text-3xl text-gray-800 font-bold mb-1">&gt;</span>
      </button>

      {/* 슬라이드 컨텐츠 컨테이너 */}
      <div className="flex items-center w-[100%] justify-between">
        {/* 이전 이미지 */}
        <div className="w-[28%] h-[55vh] opacity-80 blur-[3px] overflow-hidden shrink-0 transition-transform duration-500">
          <img
            src={travelData[getIndex(-1)].img}
            className="w-full h-full object-cover"
            alt={`${travelData[getIndex(-1)].country} 미리보기`}
          />
        </div>

        {/* 메인 이미지 */}
        <div className="relative w-full md:w-[700px] h-[55vh] max-h-[400px] overflow-hidden shrink-0 z-10 group">
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
                className={`w-full h-full object-cover transition-all duration-300`}
                alt={`${current.country} 이미지`}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 다음 이미지 */}
        <div className="w-[28%] h-[55vh] opacity-20 blur-[3px] overflow-hidden shrink-0 transition-transform duration-500">
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
