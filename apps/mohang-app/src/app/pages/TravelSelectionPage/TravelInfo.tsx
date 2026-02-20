import { motion } from 'framer-motion';
import { colors, typography } from '@mohang/ui';
import { ReactNode } from 'react';

interface Props {
  country: string;
  flagImg: string;
  desc: ReactNode;
  currentIndex: number;
}

export function TravelInfo({ country, flagImg, desc, currentIndex }: Props) {
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
        className="font-medium text-sm md:text-base px-10"
        style={{ color: colors.gray[400], ...typography.body.BodyM }}
      >
        {desc}
      </p>
    </motion.div>
  );
}
