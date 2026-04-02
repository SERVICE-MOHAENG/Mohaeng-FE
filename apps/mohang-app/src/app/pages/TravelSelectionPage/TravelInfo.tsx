import { motion } from 'framer-motion';
import { colors, typography } from '@mohang/ui';
import { ReactNode } from 'react';

interface Props {
  country: string;
  flagImg: string;
  currentIndex: number;
  onSelect: (country: string) => void;
  isSelected: boolean;
}

export function TravelInfo({
  country,
  flagImg,
  currentIndex,
  onSelect,
  isSelected,
}: Props) {
  return (
    <motion.div
      key={currentIndex}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex cursor-pointer flex-col gap-2 text-center"
      onClick={() => onSelect(country)}
    >
      <div className="flex items-center justify-center gap-3">
        <p className="mb-1 text-[28px] font-bold tracking-tight" style={typography.title.sTitleM}>
          {country}
        </p>
        <img className="mb-1 h-6 w-10" src={flagImg} alt={`${country} 국기`} />
      </div>

      <button type="button" onClick={() => onSelect(country)} className="sr-only">
        {isSelected ? '선택됨' : `${country} 선택하기`}
      </button>
    </motion.div>
  );
}
