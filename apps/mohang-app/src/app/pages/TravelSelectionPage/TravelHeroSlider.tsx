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
      <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-10 bg-gradient-to-r from-white to-transparent md:w-24" />
      <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-10 bg-gradient-to-l from-white to-transparent md:w-24" />

      <button
        onClick={onPrev}
        className="absolute left-[calc(50%-330px)] top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition-all hover:border-gray-200 hover:bg-white active:scale-90 md:left-[calc(50%-390px)] md:h-12 md:w-12"
        aria-label="이전 여행지 보기"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.9}
          stroke="currentColor"
          className="h-5 w-5 text-gray-800 md:h-6 md:w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <button
        onClick={onNext}
        className="absolute right-[calc(50%-330px)] top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition-all hover:border-gray-200 hover:bg-white active:scale-90 md:right-[calc(50%-390px)] md:h-12 md:w-12"
        aria-label="다음 여행지 보기"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.9}
          stroke="currentColor"
          className="h-5 w-5 text-gray-800 md:h-6 md:w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      <div className="flex w-full items-center justify-center gap-2 md:gap-4">
        <motion.div
          key={`prev-${currentIndex}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 0.75, x: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="hidden h-[150px] w-[92px] shrink-0 overflow-hidden rounded-2xl opacity-40 blur-[1px] transition-all sm:block md:h-[190px] md:w-[120px]"
        >
          <img
            src={travelData[getIndex(-1)].img}
            className="h-full w-full object-cover"
            alt={`${travelData[getIndex(-1)].country} 미리보기`}
          />
        </motion.div>

        <div className="relative z-10 h-[240px] w-[74%] max-w-[660px] shrink-0 overflow-hidden rounded-[32px] transition-all duration-500 sm:h-[300px] md:h-[360px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-full"
            >
              <img
                src={current.img}
                className="h-full w-full object-cover"
                alt={`${current.country} 이미지`}
              />
              <div className="pointer-events-none absolute inset-0 bg-black/5" />
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          key={`next-${currentIndex}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 0.75, x: -20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="hidden h-[150px] w-[92px] shrink-0 overflow-hidden rounded-2xl opacity-40 blur-[1px] transition-all sm:block md:h-[190px] md:w-[120px]"
        >
          <img
            src={travelData[getIndex(1)].img}
            className="h-full w-full object-cover"
            alt={`${travelData[getIndex(1)].country} 미리보기`}
          />
        </motion.div>
      </div>
    </div>
  );
}
