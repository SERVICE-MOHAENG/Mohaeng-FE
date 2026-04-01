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
    <div className="relative flex w-full items-center justify-center overflow-hidden">
      {/* 좌우 그라데이션 오버레이 - 반응형 너비 조절 */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-10 bg-gradient-to-r from-white to-transparent md:w-24" />
      <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-10 bg-gradient-to-l from-white to-transparent md:w-24" />

      {/* 슬라이드 내부 내비게이션 버튼 - 반응형 위치 조절 */}
      <button
        onClick={onPrev}
        className="absolute left-[calc(50%-330px)] top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition-all hover:border-gray-200 hover:bg-white active:scale-90 md:left-[calc(50%-390px)] md:h-12 md:w-12"
        aria-label="이전 여행지 보기"
      >
        <span className="text-xl md:text-3xl text-gray-800 font-bold mb-1">
          &lt;
        </span>
      </button>

      <button
        onClick={onNext}
        className="absolute right-[calc(50%-330px)] top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition-all hover:border-gray-200 hover:bg-white active:scale-90 md:right-[calc(50%-390px)] md:h-12 md:w-12"
        aria-label="다음 여행지 보기"
      >
        <span className="text-xl md:text-3xl text-gray-800 font-bold mb-1">
          &gt;
        </span>
      </button>

      {/* 슬라이드 컨텐츠 컨테이너 */}
      <div className="flex w-full items-center justify-center gap-2 md:gap-4">
        {/* 이전 이미지 - 강조를 위해 크기 축소 및 흐림 효과 */}
        <motion.div
          key={`prev-${currentIndex}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 0.75, x: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="hidden h-[150px] w-[92px] shrink-0 overflow-hidden rounded-2xl opacity-40 blur-[1px] transition-all sm:block md:h-[190px] md:w-[120px]"
        >
          <img
            src={travelData[getIndex(-1)].img}
            className="w-full h-full object-cover"
            alt={`${travelData[getIndex(-1)].country} 미리보기`}
          />
        </motion.div>

        {/* 메인 이미지 - 크기 확대 및 그림자 강조 */}
        <div className="relative z-10 h-[240px] w-[74%] max-w-[660px] shrink-0 overflow-hidden rounded-[32px] transition-all duration-500 sm:h-[300px] md:h-[360px]">
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
          className="hidden h-[150px] w-[92px] shrink-0 overflow-hidden rounded-2xl opacity-40 blur-[1px] transition-all sm:block md:h-[190px] md:w-[120px]"
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
