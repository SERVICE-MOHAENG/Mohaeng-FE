import { motion } from 'framer-motion';
import { typography } from '@mohang/ui';

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
      className="flex cursor-pointer flex-col gap-2 px-4 text-center"
      onClick={() => onSelect(country)}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <p
          className="mb-1 text-[24px] font-bold tracking-tight sm:text-[28px]"
          style={typography.title.sTitleM}
        >
          {country}
        </p>
        <img
          className="mb-1 h-5 w-8 sm:h-6 sm:w-10"
          src={flagImg}
          alt={`${country} 국기`}
        />
      </div>

      <button type="button" onClick={() => onSelect(country)} className="sr-only">
        {isSelected ? '선택됨' : `${country} 선택하기`}
      </button>
    </motion.div>
  );
}
