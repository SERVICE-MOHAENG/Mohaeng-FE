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
  return (
    <div className="flex gap-2 mt-10 mb-8 items-center">
      {Array.from({ length: total }).map((_, idx) => (
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
