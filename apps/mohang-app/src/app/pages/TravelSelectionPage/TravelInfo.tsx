import { motion } from 'framer-motion';
import { colors, typography } from '@mohang/ui';
import { ReactNode } from 'react';

interface Props {
  country: string;
  flagImg: string;
  desc: ReactNode;
  currentIndex: number;
  onSelect: (country: string) => void;
  isSelected: boolean;
}

export function TravelInfo({
  country,
  flagImg,
  desc,
  currentIndex,
  onSelect,
  isSelected,
}: Props) {
  return (
    <motion.div
      key={currentIndex}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col gap-2 text-center mb-4"
    >
      <div className="flex items-center justify-center gap-4">
        <p
          className="text-xl font-bold tracking-tight mb-2"
          style={typography.title.sTitleM}
        >
          {country}
        </p>
        <img className="w-10 h-6 mb-1" src={flagImg} alt={`${country} 국기`} />
      </div>
      <p
        className="font-medium text-sm md:text-base px-10 mb-4"
        style={{ color: colors.gray[400], ...typography.body.BodyM }}
      >
        {desc}
      </p>

      <div className="flex justify-center">
        <button
          onClick={() => onSelect(country)}
          className={`px-6 py-2 rounded-full font-bold transition-all active:scale-95 ${
            isSelected
              ? 'bg-cyan-100 text-cyan-600 border-2 border-cyan-400'
              : 'bg-cyan-400 text-white hover:bg-cyan-500 shadow-md'
          }`}
          style={typography.body.BodyM}

        >
          {isSelected ? '선택됨' : `${country} 선택하기`}
        </button>
      </div>
    </motion.div>
  );
}
