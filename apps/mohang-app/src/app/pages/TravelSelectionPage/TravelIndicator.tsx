import { motion } from 'framer-motion';

interface Props {
  currentIndex: number;
  total: number;
  onSelect: (index: number) => void;
  isItemSelected: (index: number) => boolean;
}

export function TravelIndicator({
  currentIndex,
  total,
  onSelect,
  isItemSelected,
}: Props) {
  const visibleIndexes = (() => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, idx) => idx);
    }

    if (currentIndex <= 2) {
      return [0, 1, 2, 3, 4];
    }

    if (currentIndex >= total - 3) {
      return [total - 5, total - 4, total - 3, total - 2, total - 1];
    }

    return [
      currentIndex - 2,
      currentIndex - 1,
      currentIndex,
      currentIndex + 1,
      currentIndex + 2,
    ];
  })();

  return (
    <div className="flex justify-center gap-2 mt-10 mb-8 items-center">
      {visibleIndexes.map((idx) => (
        <motion.div
          key={idx}
          onClick={() => onSelect(idx)}
          role="button"
          tabIndex={0}
          aria-label={`여행지 ${idx + 1} 선택`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(idx);
            }
          }}
          animate={{
            width: 24,
            backgroundColor: isItemSelected(idx)
              ? '#22D3EE' // cyan-400 for selected
              : currentIndex === idx
                ? '#525252'
                : '#E4E4E7',
            height: isItemSelected(idx) ? 4 : 2,
          }}
          className="h-0.5 rounded-full cursor-pointer transition-colors duration-300"
        />
      ))}
    </div>
  );
}
